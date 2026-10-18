// ステージの中身。座標は画像(590x1280)上の [x, y, 幅, 高さ]
// type: tap=正しい場所をタップ / scroll=指でスクロール / quiz=選択肢 / info=読んで次へ
// seq: スクロールの場面で使う連続コマ [名前, 枚数](img/seq/名前-01.jpg〜)。len は最後までに必要な指の移動量(画面何枚分か)
// target: scroll中に押せる項目。fromは表示開始コマ(1始まり)、ysは各コマのy座標。x・幅・高さは直後のtapのrectを使う
// guide: true のステージは最初から正解の枠を表示する(全ステージで有効)
// traps: 押しがちな間違いの場所と、そのときのひとこと
// marks: 確認してほしい場所に出す枠(押す場所ではない) [[x, y, 幅, 高さ], ...]
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
];
