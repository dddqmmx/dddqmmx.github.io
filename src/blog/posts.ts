import type { Locale } from '@/i18n/messages'

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'code'; lang?: string; text: string }
  | { type: 'quote'; text: string }

export type LocalizedText = Record<Locale, string>
export type LocalizedBlocks = Record<Locale, BlogBlock[]>

export type BlogPost = {
  slug: string
  /** ISO date, used for sorting and the date stamp */
  date: string
  /** Short category label shown in the noir "news" row */
  category: LocalizedText
  title: LocalizedText
  excerpt: LocalizedText
  body: LocalizedBlocks
}

/**
 * Posts are authored inline so the site stays a static SPA with no CMS.
 * Newest first is enforced by sortedPosts(); keep entries in any order here.
 */
export const posts: BlogPost[] = [
  {
    slug: 'building-arirang',
    date: '2026-07-20',
    category: {
      zh: '隐私',
      en: 'PRIVACY',
      ja: 'プライバシー',
    },
    title: {
      zh: '用 Xposed 重新夺回设备身份的控制权',
      en: 'Taking Back Control of Device Identity with Xposed',
      ja: 'Xposed で端末アイデンティティの主導権を取り戻す',
    },
    excerpt: {
      zh: 'arirang 如何在系统调用层拦截敏感设备读取，减少 App 的隐蔽追踪。',
      en: 'How arirang intercepts sensitive device reads at the syscall layer to cut covert app tracking.',
      ja: 'arirang がシステムコール層で機微な端末読み取りを遮断し、アプリの隠れた追跡を抑える方法。',
    },
    body: {
      zh: [
        { type: 'p', text: 'Android 上的应用可以通过一连串看似无害的 API，把设备拼成一个稳定的指纹：IMEI、序列号、MAC、已安装应用列表。单独看每一项都不敏感，组合起来却足以跨应用、跨重装地追踪用户。' },
        { type: 'h', text: '为什么在 Hook 层做' },
        { type: 'p', text: 'arirang 选择在 Xposed 的方法级 Hook 上工作，因为这是唯一既能覆盖所有调用方、又能对每个 App 单独放行的位置。系统权限开关太粗，网络层又看不到调用意图。' },
        { type: 'code', lang: 'java', text: 'XposedHelpers.findAndHookMethod(\n    TelephonyManager.class, "getDeviceId",\n    new XC_MethodHook() {\n        @Override\n        protected void beforeHookedMethod(MethodHookParam param) {\n            param.setResult(fakeImeiFor(currentPackage()));\n        }\n    });' },
        { type: 'p', text: '关键在于返回值要「稳定但虚假」——同一个 App 每次拿到同一个假 ID，才不会因为值跳变而触发风控。' },
        { type: 'quote', text: '隐私不是隐身，而是把「我是谁」的决定权交还给用户。' },
      ],
      en: [
        { type: 'p', text: 'Apps on Android can stitch together a stable fingerprint from a chain of individually-harmless APIs: IMEI, serial number, MAC, the list of installed packages. None is sensitive alone, yet combined they track a user across apps and reinstalls.' },
        { type: 'h', text: 'Why work at the hook layer' },
        { type: 'p', text: 'arirang lives on Xposed method-level hooks because that is the only place that both covers every caller and lets you allow-list per app. System permission toggles are too coarse; the network layer never sees the intent behind a call.' },
        { type: 'code', lang: 'java', text: 'XposedHelpers.findAndHookMethod(\n    TelephonyManager.class, "getDeviceId",\n    new XC_MethodHook() {\n        @Override\n        protected void beforeHookedMethod(MethodHookParam param) {\n            param.setResult(fakeImeiFor(currentPackage()));\n        }\n    });' },
        { type: 'p', text: 'The trick is a value that is "stable but fake" — the same app gets the same fake ID every time, so nothing trips fraud heuristics by watching the value jump around.' },
        { type: 'quote', text: 'Privacy is not invisibility. It is handing the decision of "who am I" back to the user.' },
      ],
      ja: [
        { type: 'p', text: 'Android のアプリは、単体では無害に見える一連の API から安定した指紋を組み立てられる。IMEI、シリアル番号、MAC、インストール済みアプリ一覧。どれ一つとして単独では機微でないが、組み合わせるとアプリ横断・再インストール横断でユーザーを追跡できてしまう。' },
        { type: 'h', text: 'なぜフック層で行うのか' },
        { type: 'p', text: 'arirang が Xposed のメソッド単位フックで動くのは、すべての呼び出し元を覆いつつアプリごとに許可できる唯一の場所だからだ。システム権限のトグルは粗すぎ、ネットワーク層は呼び出しの意図を見られない。' },
        { type: 'code', lang: 'java', text: 'XposedHelpers.findAndHookMethod(\n    TelephonyManager.class, "getDeviceId",\n    new XC_MethodHook() {\n        @Override\n        protected void beforeHookedMethod(MethodHookParam param) {\n            param.setResult(fakeImeiFor(currentPackage()));\n        }\n    });' },
        { type: 'p', text: '肝心なのは「安定しているが偽物」の値だ。同じアプリが毎回同じ偽 ID を受け取るので、値が変動して不正検知に引っかかることがない。' },
        { type: 'quote', text: 'プライバシーとは透明人間になることではない。「私は誰か」を決める権利をユーザーに返すことだ。' },
      ],
    },
  },
  {
    slug: 'minecraft-as-a-tunnel',
    date: '2026-06-14',
    category: {
      zh: '网络',
      en: 'NETWORK',
      ja: 'ネットワーク',
    },
    title: {
      zh: '把 Minecraft 协议当作隧道：xminecraft 的设计',
      en: 'Minecraft as a Tunnel: The Design of xminecraft',
      ja: 'Minecraft をトンネルにする：xminecraft の設計',
    },
    excerpt: {
      zh: '在游戏协议的握手内承载 TLS + VLESS，让流量看起来只是一次普通的联机。',
      en: 'Carrying TLS + VLESS inside the game handshake so traffic looks like an ordinary multiplayer session.',
      ja: 'ゲームのハンドシェイク内に TLS + VLESS を運び、通信を普通のマルチプレイに見せかける。',
    },
    body: {
      zh: [
        { type: 'p', text: '协议伪装的核心问题是：让审查者的分类器把你的流量归到「无害」那一类。Minecraft 的握手包结构固定、字段可预测，是一个理想的载体。' },
        { type: 'h', text: '在握手里藏握手' },
        { type: 'p', text: 'xminecraft 用 Rust 实现了一个 TCP 隧道：外层是合法的 Minecraft 登录序列，内层把 TLS ClientHello 塞进玩家名和后续数据包的负载里。对被动观察者来说，这就是一次正常联机。' },
        { type: 'code', lang: 'rust', text: 'async fn wrap_handshake(inner: &mut TlsStream, socket: &mut TcpStream) -> Result<()> {\n    let hello = mc::LoginStart::new(random_username());\n    socket.write_all(&hello.encode()).await?;\n    relay(inner, socket).await\n}' },
        { type: 'p', text: 'Rust 的异步栈让「两个协议同时在跑」这件事变得可控——每个方向都是独立的 future，背压天然由 tokio 处理。' },
      ],
      en: [
        { type: 'p', text: 'The core problem of protocol camouflage is getting a censor’s classifier to file your traffic under "harmless." Minecraft’s handshake has a fixed structure with predictable fields, which makes it an ideal carrier.' },
        { type: 'h', text: 'A handshake inside a handshake' },
        { type: 'p', text: 'xminecraft implements a TCP tunnel in Rust: the outer layer is a legitimate Minecraft login sequence, while the inner layer packs a TLS ClientHello into the username and the payloads of the packets that follow. To a passive observer it is just someone joining a server.' },
        { type: 'code', lang: 'rust', text: 'async fn wrap_handshake(inner: &mut TlsStream, socket: &mut TcpStream) -> Result<()> {\n    let hello = mc::LoginStart::new(random_username());\n    socket.write_all(&hello.encode()).await?;\n    relay(inner, socket).await\n}' },
        { type: 'p', text: 'Rust’s async stack keeps "two protocols running at once" manageable — each direction is an independent future, and backpressure falls out of tokio for free.' },
      ],
      ja: [
        { type: 'p', text: 'プロトコル偽装の核心は、検閲側の分類器に自分の通信を「無害」へ分類させることだ。Minecraft のハンドシェイクは構造が固定でフィールドも予測可能なので、理想的な運び手になる。' },
        { type: 'h', text: 'ハンドシェイクの中のハンドシェイク' },
        { type: 'p', text: 'xminecraft は Rust で TCP トンネルを実装する。外側は正規の Minecraft ログイン手順、内側はプレイヤー名と後続パケットのペイロードに TLS ClientHello を詰め込む。受動的な観測者にとっては、ただサーバーに参加しているだけに見える。' },
        { type: 'code', lang: 'rust', text: 'async fn wrap_handshake(inner: &mut TlsStream, socket: &mut TcpStream) -> Result<()> {\n    let hello = mc::LoginStart::new(random_username());\n    socket.write_all(&hello.encode()).await?;\n    relay(inner, socket).await\n}' },
        { type: 'p', text: 'Rust の非同期スタックは「二つのプロトコルを同時に走らせる」ことを扱いやすくする。各方向が独立した future であり、バックプレッシャは tokio が自然に処理してくれる。' },
      ],
    },
  },
  {
    slug: 'native-music-on-linux',
    date: '2026-05-02',
    category: {
      zh: '桌面',
      en: 'DESKTOP',
      ja: 'デスクトップ',
    },
    title: {
      zh: '在 Linux 上造一个原生的音乐客户端',
      en: 'Building a Native Music Client on Linux',
      ja: 'Linux でネイティブな音楽クライアントを作る',
    },
    excerpt: {
      zh: 'ncm-desktop-for-linux 为什么选择 Rust，以及原生外壳带来的取舍。',
      en: 'Why ncm-desktop-for-linux chose Rust, and the trade-offs of a native shell.',
      ja: 'ncm-desktop-for-linux が Rust を選んだ理由と、ネイティブシェルのトレードオフ。',
    },
    body: {
      zh: [
        { type: 'p', text: 'Linux 桌面上的第三方音乐客户端大多是 Electron 套壳，内存占用与启动速度都不理想。ncm-desktop-for-linux 想验证另一条路：用 Rust 写一个轻量的原生外壳。' },
        { type: 'h', text: '取舍' },
        { type: 'p', text: '原生带来了更低的资源占用和更好的系统集成（媒体键、托盘、MPRIS），代价是每个平台细节都要自己处理。但对一个「常驻后台、偶尔交互」的应用来说，这笔交换是划算的。' },
        { type: 'quote', text: '桌面应用的第一美德是安静：不打扰、不发烫、不吃满内存。' },
      ],
      en: [
        { type: 'p', text: 'Most third-party music clients on the Linux desktop are Electron shells, with unremarkable memory use and startup times. ncm-desktop-for-linux exists to test another path: a lightweight native shell written in Rust.' },
        { type: 'h', text: 'The trade-offs' },
        { type: 'p', text: 'Native buys lower resource use and better system integration — media keys, tray, MPRIS — at the cost of handling every platform detail yourself. For an app that "sits in the background and is touched occasionally," that is a good trade.' },
        { type: 'quote', text: 'The first virtue of a desktop app is to be quiet: no nagging, no heat, no eating all your RAM.' },
      ],
      ja: [
        { type: 'p', text: 'Linux デスクトップのサードパーティ音楽クライアントの多くは Electron 製で、メモリ使用量も起動速度も平凡だ。ncm-desktop-for-linux は別の道を試すために存在する。Rust で書いた軽量なネイティブシェルだ。' },
        { type: 'h', text: 'トレードオフ' },
        { type: 'p', text: 'ネイティブは低いリソース使用量とより良いシステム統合（メディアキー、トレイ、MPRIS）をもたらすが、あらゆるプラットフォームの細部を自分で扱う代償が伴う。「バックグラウンドに常駐し、たまに触る」アプリにとって、これは割に合う交換だ。' },
        { type: 'quote', text: 'デスクトップアプリの第一の美徳は静かであることだ。うるさくせず、熱くならず、メモリを食い尽くさない。' },
      ],
    },
  },
]

export function sortedPosts(): BlogPost[] {
  // ISO dates sort correctly as strings; localeCompare returns 0 on ties for a stable order.
  return [...posts].sort((a, b) => b.date.localeCompare(a.date))
}

export function findPost(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug)
}

const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const

/** 2026-07-20 -> { ymd: '2026.07.20', dow: 'MON' } */
export function formatStamp(iso: string): { ymd: string; dow: string } {
  const parts = iso.split('-')
  const y = Number(parts[0] ?? 0)
  const m = Number(parts[1] ?? 1)
  const d = Number(parts[2] ?? 1)
  const dow = DOW[new Date(Date.UTC(y, m - 1, d)).getUTCDay()] ?? ''
  return { ymd: `${y}.${String(m).padStart(2, '0')}.${String(d).padStart(2, '0')}`, dow }
}
