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
    contact: string
    language: string
  }
  about: {
    kicker: string
    title: string
    lead: string
    role: string
    summary: string
    highlights: string[]
    profileLink: string
  }
  project: {
    kicker: string
    title: string
    lead: string
    view: string
    items: Record<ProjectKey, string>
  }
  stack: {
    kicker: string
    title: string
    lead: string
    groups: {
      languages: string
      domains: string
      focus: string
    }
  }
  contact: {
    kicker: string
    title: string
    lead: string
    open: string
    issues: string
  }
}

export const messages: Record<Locale, Messages> = {
  zh: {
    nav: {
      home: '首页',
      about: '简介',
      project: '项目',
      stack: '技术栈',
      contact: '联系',
      language: '语言',
    },
    about: {
      kicker: 'About',
      title: '个人简介',
      lead: '关于我是谁、在做什么，以及我如何构建软件',
      role: '独立开发者',
      summary:
        '独立开发者，长期活跃于开源与系统向项目，关注 Android 隐私防护、Linux 桌面应用与音频/AI 工具，技术栈覆盖 C++ / Rust / Java / Python / TypeScript',
      highlights: [
        'GitHub @dddqmmx · 公开开源项目',
        'Xposed 隐私与系统模块',
        'Rust / C++ 系统与桌面开发',
      ],
      profileLink: 'GitHub 主页 →',
    },
    project: {
      kicker: 'Work',
      title: '项目列表',
      lead: '精选原创开源项目，覆盖隐私模块、桌面客户端与网络/音频工具',
      view: '查看项目 →',
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
      kicker: 'Skills',
      title: '技术栈',
      lead: '根据公开仓库语言与项目方向汇总的技术栈',
      groups: {
        languages: '语言',
        domains: '领域',
        focus: '方向',
      },
    },
    contact: {
      kicker: 'Contact',
      title: '联系方式',
      lead: '欢迎通过 GitHub 联系，讨论开源项目、协作或问题反馈',
      open: '打开 →',
      issues: '提交讨论',
    },
  },
  en: {
    nav: {
      home: 'HOME',
      about: 'ABOUT',
      project: 'PROJECT',
      stack: 'STACK',
      contact: 'CONTACT',
      language: 'LANGUAGE',
    },
    about: {
      kicker: 'About',
      title: 'About Me',
      lead: 'Who I am, what I build, and how I approach software',
      role: 'Independent Developer',
      summary:
        'Independent developer active in open-source and systems-oriented work, focused on Android privacy, Linux desktop apps, and audio/AI tools — stack: C++ / Rust / Java / Python / TypeScript',
      highlights: [
        'GitHub @dddqmmx · public open-source work',
        'Xposed privacy & system modules',
        'Rust / C++ systems & desktop development',
      ],
      profileLink: 'GitHub Profile →',
    },
    project: {
      kicker: 'Work',
      title: 'Projects',
      lead: 'Selected original open-source projects across privacy modules, desktop clients, and network/audio tools',
      view: 'View Project →',
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
      kicker: 'Skills',
      title: 'Tech Stack',
      lead: 'Languages and focus areas summarized from public repositories and project directions',
      groups: {
        languages: 'Languages',
        domains: 'Domains',
        focus: 'Focus',
      },
    },
    contact: {
      kicker: 'Contact',
      title: 'Contact',
      lead: 'Reach me on GitHub for open-source discussion, collaboration, or feedback',
      open: 'Open →',
      issues: 'Open a discussion',
    },
  },
  ja: {
    nav: {
      home: 'ホーム',
      about: '紹介',
      project: 'プロジェクト',
      stack: '技術',
      contact: '連絡',
      language: '言語',
    },
    about: {
      kicker: 'About',
      title: '自己紹介',
      lead: '何者か、何を作っているか、どうソフトウェアを構築しているか',
      role: 'インディペンデント開発者',
      summary:
        'オープンソースとシステム寄りの開発に取り組むインディ開発者で、Android のプライバシー保護、Linux デスクトップアプリ、音声/AI ツールに関心があり、技術スタックは C++ / Rust / Java / Python / TypeScript',
      highlights: [
        'GitHub @dddqmmx · 公開 OSS プロジェクト',
        'Xposed プライバシー／システムモジュール',
        'Rust / C++ によるシステムとデスクトップ開発',
      ],
      profileLink: 'GitHub プロフィール →',
    },
    project: {
      kicker: 'Work',
      title: 'プロジェクト',
      lead: 'プライバシーモジュール、デスクトップクライアント、ネットワーク/音声ツールを中心に厳選したオリジナル OSS',
      view: 'プロジェクトを見る →',
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
      kicker: 'Skills',
      title: '技術スタック',
      lead: '公開リポジトリの言語とプロジェクト方向からまとめた技術スタック',
      groups: {
        languages: '言語',
        domains: '領域',
        focus: 'フォーカス',
      },
    },
    contact: {
      kicker: 'Contact',
      title: '連絡先',
      lead: 'OSS の相談、協業、フィードバックは GitHub からどうぞ',
      open: '開く →',
      issues: 'ディスカッションを開く',
    },
  },
}

export const localeOptions: { value: Locale; label: string }[] = [
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
  { value: 'en', label: 'EN' },
]
