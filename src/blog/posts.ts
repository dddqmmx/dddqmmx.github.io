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
    slug: 'clipboard-request-interception',
    date: '2026-08-03',
    category: {
      zh: '隐私',
      en: 'PRIVACY',
      ja: 'プライバシー',
    },
    title: {
      zh: 'Android 中实时拦截剪切板请求的实现思路',
      en: 'Intercepting Clipboard Requests in Real Time on Android',
      ja: 'Android でクリップボード要求をリアルタイムにインターセプトする実装の考え方',
    },
    excerpt: {
      zh: '用全局 Xposed 模块把 Android 静默的剪切板读取改造成 iOS 式的弹窗确认，核心是 system_server 与 App 之间的 AIDL 通信与超时设计。',
      en: 'Turning Android’s silent clipboard reads into an iOS-style allow dialog with a global Xposed module, built on AIDL between system_server and an app plus a timeout design.',
      ja: 'グローバルな Xposed モジュールで、Android の静かなクリップボード読み取りを iOS 式の許可ダイアログに変える。核は system_server とアプリの AIDL 通信とタイムアウト設計。',
    },
    body: {
      zh: [
        { type: 'p', text: '我本身非常讨厌应用一打开就读取我的剪切板。为此我开发了一款全局作用域的 Xposed 模块，仅放行 Gboard 的剪切板读取请求。但问题是 Android 应用内的长按粘贴请求也被拦截了，只能在 Gboard 内手动粘贴。' },
        { type: 'p', text: '我发现 iOS 中应用主动请求剪切板内容和应用请求剪切板是分离的。在 iOS 下，应用想要读取剪切板会弹出一个弹窗让用户选择是否允许。看到之后我就知道这就是我想要的，然后开始了模块的改进工程。' },
        { type: 'h', text: '遇到的问题' },
        { type: 'p', text: '在我询问 LLM 剪切板的调用链条时，我发现这是一个非常复杂的任务。Android 的剪切板读取是通过 AIDL 向 system_server 进程直接请求的同步方法，这让我非常困扰。' },
        { type: 'p', text: '首先 hook 点位应该在哪？我应该在应用进程里把同步的函数改造成异步实现，还是在 system_server 内的 ClipboardService 进行修改呢？' },
        { type: 'p', text: '方案 1：修改应用进程内的函数实现应该是最简单的，但是我不想这样。首先每个应用都会被 Xposed 注入，而且在 LSPosed 框架下只有被勾选的应用才能生效，和我之前的全局生效相比还开了倒车。' },
        { type: 'p', text: '方案 2：如果 hook 点位在 ClipboardService，如何把这个同步函数改为异步实现？弹窗又该怎么弹出？' },
        { type: 'h', text: '尝试过程' },
        { type: 'p', text: '尝试过程过多过于冗长，知道过程也没什么价值，先省略，有可能之后会更新。' },
        { type: 'h', text: '解决方案' },
        { type: 'p', text: '既然为了全局生效且不注入应用程序层这一需求，需要选择的 hook 点位一定是 ClipboardService 的权限判断函数。既然 hook 函数确定了，怎么把弹窗弹出来呢？' },
        { type: 'p', text: '经过尝试得知 system_server 进程无法弹出，那么弹窗只能由 App 实现。最终敲定了 hook 和 App 通信的方案：我在 App 中实现了一个 Service，让 system_server 进程在开机时自动连接 App，通过 AIDL 进行通信，如发现断开则立刻重连。这样的设计不仅可以用于普通通信，还可以实现配置文件的实时更新。' },
        { type: 'p', text: '在 ClipboardService 读取请求触发后向 App 发送一个剪切板读取请求然后阻塞等待返回结果，App 在收到请求后弹出弹窗询问是否放行，根据用户返回结果判断是否放行。由于这是在 system_server 进行的阻塞，有系统彻底卡死的风险，需要在 hook 的阻塞端加上超时机制，一旦超时则不再等待返回结果直接拒绝。' },
        { type: 'p', text: '还有需要解决的问题就是一旦阻塞超过 5 秒，ANR 会弹出「未响应」弹窗。初版方案把超时时间设定在 5 秒，不过时间有点太短了。在后续的改进版本中，为了解决该问题添加了为当前阻塞应用授予临时特权的代码实现，并将超时时间延长到了 10 秒。' },
        { type: 'h', text: '总结' },
        { type: 'p', text: '由于 Android 的 API 设计的历史遗留问题过于严重，想要完美复现 iOS 内的剪切板体验还是没有做到，只有一个我个人尽力而为的妥协实现。应用内长按粘贴也会呼出弹窗，不过这也是没办法的事情。' },
        { type: 'p', text: '由于我的模块的实现范围已经从简单的权限拒绝拓展为了系统里的「幕府将军」，属于从 Android 的框架中另立朝廷，只进行剪切板修改就有点太浪费了。我就把这个模块从简单的剪切板拦截模块拓展出了一系列其他的功能，不过这都是后话了。' },
      ],
      en: [
        { type: 'p', text: 'I really dislike apps reading my clipboard the moment they open. I built a global-scope Xposed module that only permits Gboard’s clipboard read requests. But the problem was that in-app long-press paste requests were also blocked, so I could only paste manually inside Gboard.' },
        { type: 'p', text: 'I noticed that on iOS, an app actively requesting clipboard content is separated from the request itself. On iOS, when an app wants to read the clipboard, a dialog pops up asking the user whether to allow it. Once I saw that, I knew it was exactly what I wanted, and I started improving my module.' },
        { type: 'h', text: 'The problem' },
        { type: 'p', text: 'When I asked an LLM about the clipboard call chain, I found it was a very complex task. Android’s clipboard read is a synchronous method that goes directly to the system_server process via AIDL, which bothered me a lot.' },
        { type: 'p', text: 'First, where should the hook point be? Should I turn the synchronous function into an async implementation inside the app process, or modify ClipboardService within system_server?' },
        { type: 'p', text: 'Option 1: Modifying the function implementation inside the app process would be the simplest, but I did not want to do that. Every app would get injected with Xposed, and under LSPosed only checked apps take effect — a regression compared to my previous global scope.' },
        { type: 'p', text: 'Option 2: If the hook point is in ClipboardService, how do I turn this synchronous function into an async implementation? And how does the dialog get shown?' },
        { type: 'h', text: 'Attempts' },
        { type: 'p', text: 'There were too many attempts, and they were too long-winded. Knowing the process has little value, so I will skip it for now; it may be updated later.' },
        { type: 'h', text: 'The solution' },
        { type: 'p', text: 'Given the requirement of global scope without injecting the app layer, the hook point had to be ClipboardService’s permission-checking function. With the hook function decided, how do we show the dialog?' },
        { type: 'p', text: 'Through attempts I learned that the system_server process cannot show dialogs, so the dialog has to be implemented by an app. I finally settled on a hook + app communication scheme: I implemented a Service in the app, and the system_server process auto-connects to the app at boot via AIDL, immediately reconnecting if the connection drops. This design supports not just ordinary communication but also real-time config updates.' },
        { type: 'p', text: 'When a ClipboardService read request triggers, it sends a clipboard read request to the app and blocks, waiting for the result. The app pops a dialog asking whether to allow it, and permission is granted based on the user’s answer. Since this blocking happens in system_server, there is a risk of completely freezing the system, so the hook’s blocking side needs a timeout mechanism — once it times out, stop waiting and reject directly.' },
        { type: 'p', text: 'Another problem to solve: blocking for more than 5 seconds triggers the ANR “not responding” dialog. The first version set the timeout to 5 seconds, which was a bit too short. In later improved versions, I added code that grants the currently-blocked app temporary privileges and extended the timeout to 10 seconds.' },
        { type: 'h', text: 'Summary' },
        { type: 'p', text: 'Because the legacy issues in Android’s API design are too severe, perfectly reproducing the iOS clipboard experience still was not achieved — only a compromise implementation where I did my best. In-app long-press paste also pops the dialog, but there is no way around it.' },
        { type: 'p', text: 'Since the scope of my module expanded from simple permission denial into a “shogun” of the system — a separate court within the Android framework — using it only for clipboard modification felt like a waste. So I expanded the module from a simple clipboard interceptor into a series of other features. But that is a story for later.' },
      ],
      ja: [
        { type: 'p', text: '私はアプリが起動した途端にクリップボードを読まれるのが本当に嫌だ。そこでグローバルスコープの Xposed モジュールを開発し、Gboard のクリップボード読み取り要求だけを許可するようにした。ところが問題が生じた。アプリ内の長押しペースト要求も遮断され、Gboard 内で手動ペーストするしかなくなってしまった。' },
        { type: 'p', text: 'iOS では、アプリがクリップボード内容を積極的に要求する行為と、その要求自体が分離されていることに気づいた。iOS ではアプリがクリップボードを読み取ろうとすると、許可するかどうかをユーザーに問うダイアログが表示される。それを見て「これこそ自分の欲しいものだ」と確信し、モジュールの改良を始めた。' },
        { type: 'h', text: '遭遇した問題' },
        { type: 'p', text: 'LLM にクリップボードの呼び出しチェーンを尋ねてみると、これは非常に複雑なタスクだということがわかった。Android のクリップボード読み取りは、AIDL 経由で system_server プロセスに直接要求する同期メソッドだ。これには非常に悩まされた。' },
        { type: 'p', text: 'まず、フックポイントはどこにあるべきか。アプリプロセス内で同期関数を非同期実装に変えるべきなのか、それとも system_server 内の ClipboardService を修正すべきなのか。' },
        { type: 'p', text: '案 1：アプリプロセス内の関数実装を修正するのが最も簡単だが、それはやりたくなかった。まずすべてのアプリに Xposed が注入されることになり、LSPosed ではチェックされたアプリだけが有効になる。以前のグローバル有効と比べて退化だ。' },
        { type: 'p', text: '案 2：フックポイントが ClipboardService にある場合、この同期関数をどう非同期実装にするのか？ダイアログはどうやって出すのか？' },
        { type: 'h', text: '試行の過程' },
        { type: 'p', text: '試行の過程は多すぎて長すぎた。経緯を知っても価値はあまりないので省略する。将来更新するかもしれない。' },
        { type: 'h', text: '解決策' },
        { type: 'p', text: 'グローバルに有効で、アプリケーション層に注入しないという要件を満たすには、フックポイントは ClipboardService の権限判定関数にするしかない。フック関数が決まったとして、ダイアログはどう表示するのか？' },
        { type: 'p', text: '試行の結果、system_server プロセスはダイアログを表示できないことがわかったため、ダイアログはアプリが実装するしかない。最終的にフックとアプリの通信方式に落ち着いた。アプリ内に Service を実装し、system_server プロセスが起動時に AIDL 経由でアプリに自動接続、切断が検出されれば即座に再接続する。この設計は通常の通信だけでなく、設定ファイルのリアルタイム更新も可能にする。' },
        { type: 'p', text: 'ClipboardService の読み取り要求が発生すると、アプリにクリップボード読み取り要求を送り、結果を待ってブロックする。アプリは要求を受けると、許可するかどうかを問うダイアログを表示する。ユーザーの回答に基づいて許可するか判断する。これは system_server でのブロックのため、システムが完全にフリーズするリスクがある。フックのブロック側にタイムアウト機構を加え、タイムアウトしたら結果を待たずに直接拒否する必要がある。' },
        { type: 'p', text: 'もう一つ解決すべき問題は、5 秒以上ブロックすると ANR の「応答なし」ダイアログが出ることだ。初期版ではタイムアウトを 5 秒に設定したが、少し短すぎた。後の改良版では、この問題を解決するためにブロック中のアプリに一時特権を付与するコードを追加し、タイムアウトを 10 秒に延長した。' },
        { type: 'h', text: 'まとめ' },
        { type: 'p', text: 'Android の API 設計の歴史的負債は深刻すぎて、iOS のクリップボード体験を完璧に再現することは結局できなかった。ただの、私個人ができる限りを尽くした妥協実装だ。アプリ内の長押しペーストでもダイアログが表示されるが、これは仕方ない。' },
        { type: 'p', text: 'モジュールの実装範囲は、単なる権限拒否からシステムの「将軍」へと拡張され、Android のフレームワーク内に別の朝廷を立てるようなものになった。クリップボードの改変だけに使うのはもったいないので、モジュールを単純なクリップボード遮断から、さまざまな機能を備えたものへと拡張した。ただしこれはまた別の話だ。' },
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
