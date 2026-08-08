export type Locale = 'zh' | 'en' | 'ja'

export type ProjectKey =
  | 'arirang'
  | 'ncmDesktop'
  | 'xminecraft'
  | 'soVits'
  | 'uvr5'
  | 'fuckClipboard'

type Messages = {
  nav: {
    home: string
    about: string
    project: string
    stack: string
    blog: string
    contact: string
    top: string
    language: string
    primary: string
  }
  hero: {
    tagline: string
    sub: string
  }
  about: {
    title: string
    lead: string
    role: string
    summary: string
    highlights: string[]
    languagesLabel: string
    languages: string[]
    profileLink: string
  }
  project: {
    title: string
    lead: string
    view: string
    roles: Record<ProjectKey, string>
    items: Record<ProjectKey, string>
  }
  stack: {
    title: string
    lead: string
    groups: {
      languages: string
      domains: string
      focus: string
    }
  }
  blog: {
    title: string
    lead: string
    back: string
    notFound: string
  }
  contact: {
    title: string
    lead: string
    open: string
  }
}

export const messages: Record<Locale, Messages> = {
  zh: {
    nav: {
      home: '首页',
      about: '简介',
      project: '项目',
      stack: '技术栈',
      blog: '博客',
      contact: '联系',
      top: '顶部',
      language: '语言',
      primary: '主导航',
    },
    hero: {
      tagline: '软件开发者',
      sub: '隐私模块 · 桌面程序 · 音频与 AI 工具',
    },
    about: {
      title: '个人简介',
      lead: '关于我是谁、在做什么，以及我如何构建软件',
      role: '软件开发者',
      summary:
        '软件开发者，活跃于开源社区，关注 Android 隐私防护、Linux 桌面应用与音频/AI 工具，技术栈覆盖 Rust / Java / Python / TypeScript / C++',
      highlights: [
        'GitHub @dddqmmx · 公开开源项目',
        'Xposed 隐私与系统模块',
        'Rust / C++ 系统与桌面开发',
      ],
      languagesLabel: '语言',
      languages: ['简体中文', '日语'],
      profileLink: 'GitHub 主页 →',
    },
    project: {
      title: '项目列表',
      lead: '精选原创开源项目，覆盖隐私模块、桌面程序与网络/音频工具',
      view: '查看项目 →',
      roles: {
        arirang: '隐私防护模块',
        ncmDesktop: 'Linux 音乐客户端',
        xminecraft: '协议伪装隧道',
        soVits: 'AI 翻唱机器人插件',
        uvr5: '音频分离命令行',
        fuckClipboard: '剪切板拦截模块',
      },
      items: {
        arirang: '隐私向 Xposed 模块：限制应用读取敏感设备数据，减少 API 滥用带来的追踪',
        ncmDesktop: 'Linux 桌面端网易云音乐第三方客户端，基于 Rust 构建',
        xminecraft: 'Rust TCP 隧道：在 Minecraft 协议连接内承载 TLS + VLESS，实现协议伪装代理',
        soVits: '基于 so-vits-svc 的 AI 翻唱 Mirai 插件，将语音合成接入机器人工作流',
        uvr5: 'RVC WebUI 的命令行改造版，支持 UVR5 相关音频分离流程',
        fuckClipboard: 'Xposed 插件，阻止 Android 应用读取剪贴板内容',
      },
    },
    stack: {
      title: '技术栈',
      lead: '根据公开仓库语言与项目方向汇总的技术栈',
      groups: {
        languages: '语言',
        domains: '领域',
        focus: '方向',
      },
    },
    blog: {
      title: '博客',
      lead: '关于开源、系统开发与设计的记录',
      back: '← 返回博客',
      notFound: '文章不存在',
    },
    contact: {
      title: '联系方式',
      lead: '欢迎通过邮箱或 GitHub 联系，讨论开源项目、协作或问题反馈',
      open: '打开 →',
    },
  },
  en: {
    nav: {
      home: 'HOME',
      about: 'ABOUT',
      project: 'PROJECT',
      stack: 'STACK',
      blog: 'BLOG',
      contact: 'CONTACT',
      top: 'TOP',
      language: 'LANGUAGE',
      primary: 'Primary',
    },
    hero: {
      tagline: 'Software Developer',
      sub: 'Privacy modules · desktop applications · audio & AI tools',
    },
    about: {
      title: 'About Me',
      lead: 'Who I am, what I build, and how I approach software',
      role: 'Software Developer',
      summary:
        'Software developer active in the open-source community, focused on Android privacy, Linux desktop apps, and audio/AI tools — stack: Rust / Java / Python / TypeScript / C++',
      highlights: [
        'GitHub @dddqmmx · public open-source work',
        'Xposed privacy & system modules',
        'Rust / C++ systems & desktop development',
      ],
      languagesLabel: 'Languages',
      languages: ['Simplified Chinese', 'Japanese'],
      profileLink: 'GitHub Profile →',
    },
    project: {
      title: 'Projects',
      lead: 'Selected original open-source projects across privacy modules, desktop applications, and network/audio tools',
      view: 'View Project →',
      roles: {
        arirang: 'Privacy defense module',
        ncmDesktop: 'Music client for Linux',
        xminecraft: 'Protocol camouflage tunnel',
        soVits: 'AI cover bot plugin',
        uvr5: 'Audio separation CLI',
        fuckClipboard: 'Clipboard interception module',
      },
      items: {
        arirang:
          'Privacy-focused Xposed module that limits apps from reading sensitive device data and reduces tracking via API abuse',
        ncmDesktop: 'Third-party NetEase Cloud Music client for Linux desktop, built with Rust',
        xminecraft:
          'Rust TCP tunnel carrying TLS + VLESS inside a Minecraft protocol connection for protocol camouflage proxying',
        soVits: 'Mirai plugin for AI cover songs with so-vits-svc, wiring voice synthesis into bot workflows',
        uvr5: 'CLI adaptation of RVC WebUI for UVR5-related audio separation workflows',
        fuckClipboard: 'Xposed plugin that blocks Android apps from reading clipboard content',
      },
    },
    stack: {
      title: 'Tech Stack',
      lead: 'Languages and focus areas summarized from public repositories and project directions',
      groups: {
        languages: 'Languages',
        domains: 'Domains',
        focus: 'Focus',
      },
    },
    blog: {
      title: 'Blog',
      lead: 'Notes on open source, systems work, and design',
      back: '← Back to Blog',
      notFound: 'Post not found',
    },
    contact: {
      title: 'Contact',
      lead: 'Reach me by email or on GitHub for open-source discussion, collaboration, or feedback',
      open: 'Open →',
    },
  },
  ja: {
    nav: {
      home: 'ホーム',
      about: '紹介',
      project: 'プロジェクト',
      stack: '技術',
      blog: 'ブログ',
      contact: '連絡',
      top: 'トップ',
      language: '言語',
      primary: 'メインナビゲーション',
    },
    hero: {
      tagline: 'ソフトウェア開発者',
      sub: 'プライバシーモジュール · デスクトッププログラム · 音声 / AI ツール',
    },
    about: {
      title: '自己紹介',
      lead: '何者か、何を作っているか、どうソフトウェアを構築しているか',
      role: 'ソフトウェア開発者',
      summary:
        'オープンソースコミュニティで活動するソフトウェア開発者で、Android のプライバシー保護、Linux デスクトップアプリ、音声/AI ツールに関心があり、技術スタックは Rust / Java / Python / TypeScript / C++',
      highlights: [
        'GitHub @dddqmmx · 公開 OSS プロジェクト',
        'Xposed プライバシー／システムモジュール',
        'Rust / C++ によるシステムとデスクトップ開発',
      ],
      languagesLabel: '言語',
      languages: ['簡体中国語', '日本語'],
      profileLink: 'GitHub プロフィール →',
    },
    project: {
      title: 'プロジェクト',
      lead: 'プライバシーモジュール、デスクトッププログラム、ネットワーク/音声ツールを中心に厳選したオリジナル OSS',
      view: 'プロジェクトを見る →',
      roles: {
        arirang: 'プライバシー防御モジュール',
        ncmDesktop: 'Linux 向け音楽クライアント',
        xminecraft: 'プロトコル偽装トンネル',
        soVits: 'AI カバー ボットプラグイン',
        uvr5: '音源分離 CLI',
        fuckClipboard: 'クリップボード遮断モジュール',
      },
      items: {
        arirang:
          'プライバシー重視の Xposed モジュールで、アプリによる機微な端末データ読み取りを制限し、API 乱用による追跡を抑える',
        ncmDesktop: 'Rust 製の Linux 向け NetEase Cloud Music サードパーティクライアント',
        xminecraft:
          'Minecraft プロトコル接続内で TLS + VLESS を運ぶ Rust TCP トンネルで、プロトコル偽装プロキシを実現',
        soVits: 'so-vits-svc を用いた AI カバー曲の Mirai プラグインで、音声合成をボット連携に組み込む',
        uvr5: 'RVC WebUI の CLI 改修版で、UVR5 関連の音源分離ワークフローに対応',
        fuckClipboard: 'Android アプリのクリップボード読み取りを阻止する Xposed プラグイン',
      },
    },
    stack: {
      title: '技術スタック',
      lead: '公開リポジトリの言語とプロジェクト方向からまとめた技術スタック',
      groups: {
        languages: '言語',
        domains: '領域',
        focus: 'フォーカス',
      },
    },
    blog: {
      title: 'ブログ',
      lead: 'オープンソース、システム開発、デザインについての記録',
      back: '← ブログへ戻る',
      notFound: '記事が見つかりません',
    },
    contact: {
      title: '連絡先',
      lead: 'OSS の相談、協業、フィードバックはメールまたは GitHub からどうぞ',
      open: '開く →',
    },
  },
}

export const localeOptions: { value: Locale; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '简体中文' },
]
