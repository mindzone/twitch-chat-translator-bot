import { useTwitchToken } from "@/composables/useTwitchToken.ts";
import { useTwitchUsername } from "@/composables/useTwitchUsername.ts";
import { getTokenInfo, StaticAuthProvider, TokenInfo } from "@twurple/auth";
import { ChatClient } from "@twurple/chat";
import { onMounted, onUnmounted, ref } from "vue";
import { EventEmitter, Listener } from '@d-fischer/typed-event-emitter';

class Twitch extends EventEmitter {
    public onConnectStateChanged = this.registerEvent();
    public onJoinedStateChanged = this.registerEvent();
    private chatClient: ChatClient | undefined = undefined;
    private tokenInfo: TokenInfo | undefined = undefined;
    private channel: string | undefined = undefined;
    private isConnected = false;
    private isConnecting = false;
    private hasJoined = false;
    private isJoining = false;

    public get connected() {
        return this.isConnected;
    }

    public get connecting() {
        return this.isConnecting;
    }

    public get joined() {
        return this.hasJoined;
    }

    public get joining() {
        return this.isJoining;
    }

    public get connectedAs() {
        return this.tokenInfo?.userName;
    }

    public get joinedChannels() {
        return this.chatClient?.currentChannels.map(channel => channel.replace('#', '')) ?? [];
    }

    public async connect(token: string, channel: string) {
        try {
            this.channel = channel;
            this.isConnecting = true;
            this.emit(this.onConnectStateChanged);

            this.tokenInfo = await getTokenInfo(token);
            this.chatClient = new ChatClient({
                authProvider: new StaticAuthProvider(this.tokenInfo.clientId, token, this.tokenInfo.scopes),
                isAlwaysMod: false,
                channels: [channel]
            });

            this.chatClient.onConnect(() => {
                this.isConnected = true;
                this.isConnecting = false;
                this.hasJoined = false;
                this.isJoining = true;

                this.emit(this.onConnectStateChanged);
                this.emit(this.onJoinedStateChanged);
            });

            this.chatClient.onDisconnect(() => {
                this.isConnected = false;
                this.isConnecting = false;

                this.emit(this.onConnectStateChanged);
            });

            this.chatClient.onPart(() => {
                this.hasJoined = false;
                this.isJoining = false;

                setTimeout(() => {
                    this.emit(this.onJoinedStateChanged);
                }, 15);
            });

            this.chatClient.onJoin(() => {
                this.hasJoined = true;
                this.isJoining = false;

                setTimeout(() => {
                    this.emit(this.onJoinedStateChanged);
                }, 15);
            });

            this.chatClient.onJoinFailure(() => {
                this.hasJoined = false;
                this.isJoining = false;

                setTimeout(() => {
                    this.emit(this.onJoinedStateChanged);
                }, 15);
            });

            this.chatClient.onMessage((channel, user, text, message) => {
                console.log(`Received a message from ${user} in ${channel}: ${text}`);

                console.log({message})
            })

            this.chatClient.connect();
        } catch (e) {
            console.error(e);
            this.resetState();
        }
    }

    public async disconnect() {
        if (this.channel && this.chatClient) {
            this.chatClient?.part(this.channel);
        }
        this.resetState();
    }

    public async join() {
        if (this.channel) {
            this.hasJoined = false;
            this.isJoining = true;

            this.emit(this.onJoinedStateChanged);
            await this.chatClient?.join(this.channel);
        }
    }

    private resetState() {
        this.isConnected = false;
        this.isConnecting = false;
        this.hasJoined = false;
        this.isJoining = false;
        this.channel = undefined;
        this.tokenInfo = undefined;
        this.chatClient = undefined;
        this.emit(this.onConnectStateChanged);
        this.emit(this.onJoinedStateChanged);
    }
}

// "hack" to preserve the Twitch instance during local development and hot-reloading.
// @fixme there probably is a better way but for now this will do.
/* @ts-ignore */
globalThis.twitch ??= new Twitch();
/* @ts-ignore */
const twitch: Twitch = globalThis.twitch;

export function useTwitch() {
    const {token} = useTwitchToken();
    const {username} = useTwitchUsername();

    const joined = ref(false);
    const joining = ref(false);
    const connected = ref(false);
    const connecting = ref(false);
    const connectedAs = ref<string | undefined | null>(undefined);
    const joinedChannels = ref<string | undefined>(undefined);

    function syncState() {
        connected.value = twitch.connected;
        connecting.value = twitch.connecting;
        joined.value = twitch.joined;
        joining.value = twitch.joining;
        connectedAs.value = twitch.connectedAs;
        joinedChannels.value = twitch.joinedChannels.join(', ');
    }

    async function connect() {
        if (!twitch.connected && !twitch.connecting && token.value && username.value) {
            await twitch.connect(token.value, username.value);
        }
    }

    async function disconnect() {
        await twitch.disconnect();
    }

    async function join() {
        await twitch.join();
    }

    const joinedStateListener = ref<Listener>(twitch.onJoinedStateChanged(() => {
        syncState();
    }));

    const connectedStateListener = ref<Listener>(twitch.onConnectStateChanged(() => {
        syncState();
    }));

    onMounted(async () => {
        syncState();
        await connect();
    });

    onUnmounted(() => {
        joinedStateListener.value.unbind();
        connectedStateListener.value.unbind();
    });

    return {
        joined,
        joining,
        connected,
        connecting,
        connect,
        disconnect,
        join,
        connectedAs,
        joinedChannels
    };
}