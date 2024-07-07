import { useTwitchToken } from "@/composables/useTwitchToken.ts";
import { useTwitchUsername } from "@/composables/useTwitchUsername.ts";
import { getTokenInfo, StaticAuthProvider } from "@twurple/auth";
import { ChatClient } from "@twurple/chat";
import { onMounted, onUnmounted, ref } from "vue";
import { EventEmitter, Listener } from '@d-fischer/typed-event-emitter';

class Twitch extends EventEmitter {
    public onConnectStateChanged = this.registerEvent();
    public onJoinedStateChanged = this.registerEvent();
    private chatClient: ChatClient | undefined = undefined;
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

    public async connect(token: string, channel: string) {
        try {
            this.channel = channel;
            this.isConnecting = true;
            this.emit(this.onConnectStateChanged);

            const info = await getTokenInfo(token);
            this.chatClient = new ChatClient({
                authProvider: new StaticAuthProvider(info.clientId, token, info.scopes),
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

                this.emit(this.onJoinedStateChanged);
            });

            this.chatClient.onJoin(() => {
                this.hasJoined = true;
                this.isJoining = false;

                this.emit(this.onJoinedStateChanged);
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
            await this.chatClient?.join(this.channel);
        }
    }

    private resetState() {
        this.isConnected = false;
        this.isConnecting = false;
        this.hasJoined = false;
        this.isJoining = false;
        this.channel = undefined;
        this.chatClient = undefined;
        this.emit(this.onConnectStateChanged);
        this.emit(this.onJoinedStateChanged);
    }
}

const twitch = new Twitch();

export function useTwitch() {
    const {token} = useTwitchToken();
    const {username} = useTwitchUsername();

    const joined = ref(false);
    const joining = ref(false);
    const connected = ref(false);
    const connecting = ref(false);

    function syncState() {
        connected.value = twitch.connected;
        connecting.value = twitch.connecting;
        joined.value = twitch.joined;
        joining.value = twitch.joining;
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
    };
}