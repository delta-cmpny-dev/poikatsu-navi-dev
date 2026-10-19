// ステージの中身。座標は画像(590x1280)上の [x, y, 幅, 高さ]
// type: tap=正しい場所をタップ / scroll=指でスクロール / quiz=選択肢 / info=読んで次へ
// seq: スクロールの場面で使う連続コマ [名前, 枚数](img/seq/名前-01.jpg〜)。len は最後までに必要な指の移動量(画面何枚分か)
// target: scroll中に押せる項目。fromは表示開始コマ(1始まり)、ysは各コマのy座標。x・幅・高さは直後のtapのrectを使う
// guide: true のステージは最初から正解の枠を表示する(全ステージで有効)
// traps: 押しがちな間違いの場所と、そのときのひとこと
// alts: rect のほかにも正解にするタップ場所 [[x, y, 幅, 高さ], ...](枠は marks で出す)
// marks: 確認してほしい場所に出す枠(押す場所ではない) [[x, y, 幅, 高さ], ...]
// guide: false をステップに付けると、そのステップだけ最初の枠を出さない
// traps[].alert: 間違えたときに、トーストではなく重要ポイントとして出す文(進まない)
// next: info の「次へ」ボタンの文言 / review: クリア画面のおさらいにだけ出す文
// warn: 正解のあとに出す重要ポイント(クリア画面のおさらいにも出る)
// img / after: img/ 内の拡張子なしの名前。info / quiz の img は省略可
// html: 画像の代わりに表示する信頼済みの静的HTML(590x1280)。外部入力を入れない
// video: 'name' 注釈入りの手順動画(video/name.mp4)をアプリ内で再生する
// 架空画面の部品。ボタンと判定を同じ座標で作り、縮小しても位置を合わせる。
function fxScreen(title, body = '', buttons = []) {
  return `<div class="fx-address">9:41　　▰ ▰ ▰<div>🔒 practice.example　↻</div></div>
    <div class="fx-brand">○○FX <span>練習用・架空の画面</span></div>
    <div class="fx-body"><h2>${title}</h2>${body}</div>` +
    buttons.map(b => `<div class="fx-button ${b.muted ? 'muted' : ''}" style="left:${b.rect[0]}px;top:${b.rect[1]}px;width:${b.rect[2]}px;height:${b.rect[3]}px">${b.label}</div>`).join('') +
    '<div class="fx-footer">‹　　□　　＋　　▣</div>';
}
const STAGES = [
  {
    id: 'safari',
    guide: true,
    title: '準備編　Safariの設定',
    lead: '申し込みの前にやっておく設定',
    steps: [
      { type: 'info', img: 'safari-15', text: 'ポイントサイトに申し込むときは、必ず「Safari」を使います。',
        sub: '普段Chromeなど別のブラウザを使っている人も、申し込むときはSafari。まずは設定を整えよう。' },
      { type: 'tap', img: 'safari-15', text: '「設定」アプリを開こう', rect: [30, 95, 120, 137],
        traps: [{ rect: [170, 1130, 115, 115], msg: 'Safariを使うのは後。まず「設定」から' }] },
      { type: 'scroll', img: 'safari-150', seq: ['set', 25], len: 0.8, text: '下にスクロールして「アプリ」を探してタップしよう',
        target: { from: 16, ys: [746,746,746,746,670,992,847,719,606,532,449,331,208,143,940,1101,1076,1036,1005,976,982,994,989,952,957] } },
      { type: 'tap', img: 'safari-150', text: '「アプリ」をタップ', rect: [22, 957, 546, 84] },
      { type: 'tap', img: 'safari-315', text: '「Safari」をタップ', rect: [22, 214, 546, 80] },
      { type: 'scroll', img: 'safari-390', seq: ['saf', 28], len: 1.3, text: '下にスクロールして「サイト越えトラッキングを防ぐ」を探してオフにしよう',
        target: { from: 20, ys: [697,697,697,441,263,191,349,341,329,323,321,319,260,276,160,1079,1024,822,571,1198,1073,956,768,615,513,453,411,362] } },
      { type: 'tap', img: 'safari-540', after: 'safari-603', text: '①「サイト越えトラッキングを防ぐ」をオフにしよう', rect: [22, 348, 546, 82],
        warn: '「サイト越えトラッキングを防ぐ」は一度設定すればキープされるので、毎回の確認は不要。' },
      { type: 'scroll', img: 'safari-680', seq: ['hist', 13], len: 0.5, text: 'さらに下にスクロールして「履歴とWebサイトデータを消去」を探してタップしよう',
        target: { from: 1, ys: [1084,1049,951,905,806,715,677,643,643,615,576,572,572] } },
      { type: 'tap', img: 'safari-680', text: '②「履歴とWebサイトデータを消去」をタップ', rect: [22, 572, 546, 82] },
      { type: 'tap', img: 'safari-990', text: '「すべての履歴」が選ばれているのを確認して、「履歴を消去」をタップ', rect: [30, 1110, 530, 84], marks: [[38, 798, 515, 77]],
        traps: [{ rect: [520, 420, 70, 70], msg: '閉じないで、消去まで進もう' }] },
      { type: 'quiz', img: 'safari-1130', text: '②の「履歴の消去」は、いつやる？',
        choices: [{ label: '案件に申し込む前に毎回', ok: true }, { label: '最初の1回だけ', msg: '1回だけではダメ。毎回やろう' }],
        warn: '履歴の消去は、案件に申し込む前に毎回必ず実施。サボってポイントがうまく反映されなかった場合、数万円を取り逃すことになる。' },
      { type: 'quiz', img: 'safari-1130', text: '③コンテンツブロッカー（広告ブロッカー）を入れている人は？',
        choices: [{ label: '入れたままでOK', msg: '入れたままだとNG' }, { label: '申し込み時は毎回オフ', ok: true }],
        warn: 'コンテンツブロッカー（広告ブロッカー）を入れている人は、申し込み時は毎回オフにする。' },
      { type: 'scroll', img: 'safari-ck-195', seq: ['cookie', 51], len: 1.4, text: '最後に、Safari設定を下にスクロールして「詳細」を探してタップしよう',
        target: { from: 27, ys: [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,1185,1171,1146,1123,1098,1085,1069,1060,1047,1040,1030,1024,1019,1016,1012,1011,1043,1062,1076,1083,1088,1090,1091,1092,1092] } },
      { type: 'tap', img: 'safari-ck-195', text: '「詳細」をタップ', rect: [24, 1092, 542, 80] },
      { type: 'tap', img: 'safari-ck-225', after: 'safari-ck-345', text: '「すべてのCookieをブロック」をオフにしよう', rect: [30, 495, 538, 78] },
      { type: 'info', img: 'safari-ck-345', card: 'top', text: '完了！', sub: '「すべてのCookieをブロック」がオフになりました。これでSafariの設定は終わりです。' },
    ],
  },
  {
    id: 'passbook',
    title: 'ポイント通帳の見方（ハピタス版）',
    lead: 'ハピタスで「有効」「無効」を見分けよう',
    guide: true,
    steps: [
      { type: 'tap', img: 'hapitas-home', guide: false, text: 'ポイントサイト「ハピタス」を開こう', rect: [445, 98, 110, 132],
        traps: [{ rect: [309, 98, 110, 132], alert: 'ポイントサイトはアプリでは絶対開かない！　※Safariから開く癖をつけよう' }],
        review: 'ポイントサイトはアプリでは絶対開かない！ Safariから開く癖をつけよう。' },
      { type: 'tap', img: 'hapitas-top', text: 'マイページを開こう', rect: [100, 1058, 92, 84] },
      { type: 'tap', img: 'hapitas-menu', text: 'ポイント通帳を開こう', rect: [12, 418, 475, 70] },
      { type: 'info', img: 'hapitas-valid', card: 'bottom', next: '理解した', marks: [[160, 352, 140, 62]],
        text: '有効：ポイント獲得条件を達成し、ハピタスから承認された時のステータスです。',
        review: '有効：ポイント獲得条件を達成し、ハピタスから承認された時のステータス。' },
      { type: 'info', img: 'hapitas-invalid', card: 'bottom', next: '理解した', marks: [[298, 352, 140, 62]],
        text: '無効：何らかの理由でポイントが却下された場合のステータスです。',
        review: '無効：何らかの理由でポイントが却下された場合のステータス。' },
    ],
  },
  {
    id: 'passbook-moppy',
    title: 'ポイント通帳の見方（moppy版）',
    lead: 'モッピーで「承認」「否認」を見分けよう',
    guide: true,
    steps: [
      { type: 'tap', img: 'moppy-home', guide: false, text: 'ポイントサイト「moppy」を開こう', rect: [445, 98, 110, 132],
        traps: [{ rect: [173, 98, 110, 132], alert: 'ポイントサイトはアプリでは絶対開かない！　※Safariから開く癖をつけよう' }],
        review: 'ポイントサイトはアプリでは絶対開かない！ Safariから開く癖をつけよう。' },
      { type: 'tap', img: 'moppy-top', text: '左上の横3本線を開こう', rect: [22, 175, 64, 64] },
      { type: 'tap', img: 'moppy-menu', text: 'マイページを開こう', rect: [33, 838, 100, 132] },
      { type: 'scroll', img: 'moppy-menu', seq: ['moppymp', 43], len: 1.4, text: '下にスクロールしよう' },
      { type: 'info', img: 'moppy-ok', card: 'bottom', next: '理解した', marks: [[174, 419, 113, 60]],
        text: '承認：ポイント獲得条件を達成し、moppyから承認された時のステータスです。',
        review: '承認：ポイント獲得条件を達成し、moppyから承認された時のステータス。' },
      { type: 'info', img: 'moppy-ng', card: 'bottom', next: '理解した', marks: [[303, 419, 113, 60]],
        text: '否認：何らかの理由でポイントが却下された場合のステータスです。',
        review: '否認：何らかの理由でポイントが却下された場合のステータス。' },
    ],
  },
  {
    id: 'offer-flow',
    title: '案件の進め方（ポイントサイト経由）',
    lead: 'スクールの案内からポイントサイト経由で申し込むまで',
    guide: true,
    steps: [
      { type: 'info', img: 'wt-school', card: 'bottom', marks: [[27, 373, 125, 21], [27, 765, 125, 21], [48, 916, 125, 21]],
        text: 'スクールで案内された案件から、ポイントサイト経由であることを確認しよう',
        review: 'スクールで案内された案件は、ポイントサイト経由であることを確認する。' },
      { type: 'tap', img: 'wt-home', guide: false, text: 'ポイントサイト「moppy」を開こう', rect: [445, 98, 110, 132],
        traps: [{ rect: [173, 98, 110, 132], alert: 'ポイントサイトはアプリでは絶対開かない！　※Safariから開く癖をつけよう' }],
        review: 'ポイントサイトはアプリでは絶対開かない！ Safariから開く癖をつけよう。' },
      { type: 'tap', img: 'wt-top', text: '検索欄に案件名を入力しよう', rect: [22, 270, 410, 62] },
      { type: 'tap', img: 'wt-search', text: '同じ案件をタップ', rect: [22, 634, 174, 310] },
      { type: 'info', img: 'wt-offer', card: 'bottom', next: '確認した', marks: [[22, 286, 540, 64]],
        text: '同じ案件であることを確認しよう',
        review: '案件名が、スクールで案内された案件と同じことを確認する。' },
      { type: 'info', img: 'wt-offer', card: 'bottom', next: '確認した', marks: [[400, 560, 168, 60]],
        text: 'スクールで案内された獲得ポイントと同じことを確認しよう',
        review: '獲得ポイントが、スクールの案内と同じことを確認する。' },
      { type: 'tap', img: 'wt-offer', text: '「POINT GET!」からWEBサイトに移動しよう', rect: [125, 652, 442, 102] },
      { type: 'info', img: 'wt-site', card: 'bottom', next: 'OK', text: 'スクールで案内された手順で進めていこう' },
      { type: 'quiz', img: 'wt-site', text: '超重要ポイントクイズ　作業中は別のページへ移動したり、他のアプリを開いても大丈夫？',
        choices: [{ label: '大丈夫', msg: '別作業は絶対ダメ！' }, { label: '別作業は絶対ダメ', ok: true }],
        warn: '別作業は絶対ダメ！最悪の場合、ポイントが無効になる。' },
    ],
  },
  {
    id: 'browser-flow',
    title: '案件の進め方（ブラウザ経由）',
    lead: 'スクールの案内のURLをSafariで開くまで',
    guide: true,
    steps: [
      { type: 'info', img: 'bf-school', card: 'bottom', marks: [[324, 685, 190, 24]],
        text: 'スクールで案内された案件から、ブラウザ経由であることを確認しよう',
        review: 'スクールで案内された案件は、ブラウザ経由であることを確認する。' },
      { type: 'tap', img: 'bf-copy', text: 'URLを選択し、コピーしよう', rect: [100, 624, 116, 62] },
      { type: 'tap', img: 'bf-home', guide: false, text: 'ブラウザを開こう', rect: [445, 98, 110, 132],
        traps: [{ rect: [173, 98, 110, 132], alert: 'ポイントサイトはアプリでは絶対開かない！　※Safariから開く癖をつけよう' }, { rect: [309, 98, 110, 132], alert: 'ポイントサイトはアプリでは絶対開かない！　※Safariから開く癖をつけよう' }],
        review: 'ポイントサイトはアプリでは絶対開かない！ Safariから開く癖をつけよう。' },
      { type: 'tap', img: 'bf-search', text: 'ブラウザの検索欄にペーストしよう', rect: [26, 72, 538, 66] },
      { type: 'tap', img: 'bf-paste', text: 'ブラウザの検索欄にペーストしよう', rect: [42, 150, 112, 54] },
      { type: 'tap', img: 'bf-go', card: 'top', text: 'どちらでも良いのでタップしよう', rect: [40, 345, 420, 75],
        alts: [[474, 1018, 104, 152]], marks: [[474, 1018, 104, 152]] },
      { type: 'info', img: 'bf-site', card: 'bottom', next: 'OK', text: 'スクールで案内された手順で進めていこう' },
    ],
  },
];
