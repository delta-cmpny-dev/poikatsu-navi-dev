// ステージの中身。座標は画像(590x1280)上の [x, y, 幅, 高さ]
// type: tap=正しい場所をタップ / scroll=指でスクロール / quiz=選択肢 / info=読んで次へ
// seq: スクロールの場面で使う連続コマ [名前, 枚数](img/seq/名前-01.jpg〜)。len は最後までに必要な指の移動量(画面何枚分か)
// target: scroll中に押せる項目。fromは表示開始コマ(1始まり)、ysは各コマのy座標。x・幅・高さは直後のtapのrectを使う
// guide: true のステージは最初から正解の枠を表示する(全ステージで有効)
// traps: 押しがちな間違いの場所と、そのときのひとこと
// cardAt: 説明を出す高さ(590x1280の座標)。card より優先
// alts: rect のほかにも正解にするタップ場所 [[x, y, 幅, 高さ], ...](押す場所と同じく光る枠が出る)
// marks: 確認してほしい場所に出す枠(押す場所ではない) [[x, y, 幅, 高さ], ...]
// guide: false をステップに付けると、そのステップだけ最初の枠を出さない
// traps[].alert: 間違えたときに、トーストではなく重要ポイントとして出す文(進まない)
// label: カードの上の小さな見出し(省略時は種類ごとの既定)
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
    id: 'fx-demo',
    title: 'FXデモトレード',
    lead: 'MXNJPYで合計101lotの取引を練習しよう',
    guide: true,
    steps: [
      { type: 'info', text: '取引の前に、アプリの「LIGHTモード」をオフにしておこう', sub: 'ここからはスピード注文の画面で進めます。' },
      { type: 'tap', img: 'fx-v1-5', text: '通貨ペアの欄をタップ', rect: [8, 113, 284, 57] },
      { type: 'tap', img: 'fx-v1-15', text: '「MXNJPY」を選ぼう', rect: [60, 520, 150, 105] },
      { type: 'tap', img: 'fx-v1-32', text: '真ん中の「両建: ON…」の欄をタップ', rect: [18, 752, 554, 44] },
      { type: 'tap', img: 'fx-v1-34', text: '注文数量の欄をタップ', rect: [310, 450, 165, 55] },
      { type: 'tap', img: 'fx-v1-45', text: '「10」と入力して「OK」をタップ', rect: [298, 798, 252, 68] },
      { type: 'tap', img: 'fx-v1-46', text: '注文数量が10.0になったら「設定」をタップ', sub: 'それ以外の項目は、そのままでOK。', rect: [304, 902, 246, 53], marks: [[310, 450, 165, 55]] },
      { type: 'info', img: 'fx-v1-52', card: 'top', next: '確認した', marks: [[244, 850, 104, 48], [306, 1082, 278, 52]],
        text: 'スプレッド（青と赤の間の数字）が0.3以下で、「注文ロック」がOFFになっているか確認しよう',
        review: 'スプレッドが0.3以下で、注文ロックがOFFであることを確認してから取引する。' },
      { type: 'tap', img: 'fx-v2-1', text: '「(買) Ask」をタップ', rect: [302, 810, 268, 128] },
      { type: 'tap', img: 'fx-v2-3', text: '「注文実行」をタップ', rect: [308, 964, 242, 54] },
      { type: 'tap', img: 'fx-v2-7', text: '「閉じる」をタップ', rect: [38, 694, 244, 54] },
      { type: 'tap', img: 'fx-v2-9', text: 'すぐに「買建玉全決済」をタップ', rect: [395, 993, 177, 54] },
      { type: 'tap', img: 'fx-v2-12b', text: '「全決済実行」をタップ', rect: [308, 766, 242, 54] },
      { type: 'tap', img: 'fx-v2-13b', text: '「閉じる」をタップ', rect: [38, 694, 244, 54],
        warn: '↑で10lotの取引が1回完了！\nこれを合計10回くり返そう。' },
      { type: 'tap', img: 'fx-v4-2', text: '10回終わったら、注文数量の欄をタップ', rect: [368, 113, 148, 57] },
      { type: 'tap', img: 'fx-v4-6', text: '「1」と入力して「OK」をタップ', rect: [298, 798, 252, 68] },
      { type: 'info', img: 'fx-v4-8b', card: 'bottom', next: 'OK', marks: [[368, 113, 148, 57]],
        text: '数量が1.0になったら、同じように「(買) Ask」→「買建玉全決済」を1回やろう',
        review: '10lotを10回のあと、1lotで1回。合計101lotの取引になる。' },
      { type: 'tap', img: 'fx-v4-15', text: '取引が終わったら、右下の「メニュー」をタップ', rect: [496, 1158, 84, 64] },
      { type: 'tap', img: 'fx-v4-28', text: '「約定履歴」をタップ', rect: [10, 612, 575, 62] },
      { type: 'info', img: 'fx-v4-33', card: 'bottom', next: '確認した', marks: [[8, 540, 577, 160], [8, 205, 577, 168]],
        text: '10lotの買と売の2行で1セット。合計11セットあるか確認しよう',
        warn: '10lotの買と売の2行で1セット。\n10lotが10セット、1lotが1セット、合計11セットあることを確認！\n11セット全て表示されない場合は、画面を下にスクロールしよう。' },
    ],
  },
];
