const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');

const slides = JSON.parse(fs.readFileSync(path.join(__dirname, 'slides_text.json'), 'utf8'));
const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'OpenClaw';
pptx.company = 'Midocean University';
pptx.subject = 'Thesis Presentation Redesign';
pptx.title = 'Interactive Social Media Federated Recommendation System';
pptx.lang = 'en-US';
pptx.theme = {
  headFontFace: 'Aptos Display',
  bodyFontFace: 'Aptos',
  lang: 'en-US'
};

const C = {
  navy: '0F172A',
  blue: '15A9F5',
  text: '334155',
  light: 'F8FBFE',
  border: 'D7ECF8'
};
const logo = path.join('/Users/odai/clawd', 'logo.png');
const total = slides.length;

function addBg(slide, n) {
  slide.background = { color: C.light };
  slide.addShape(pptx.ShapeType.rect, { x:0, y:0, w:13.333, h:7.5, fill:{color:'F7FBFF'}, line:{color:'F7FBFF'} });
  slide.addText(`${String(n).padStart(2,'0')} / ${String(total).padStart(2,'0')}`, {
    x:11.8, y:7.03, w:1.1, h:0.22, fontSize:11, bold:true, color:'60758A', align:'right', margin:0
  });
  slide.addImage({ path: logo, x:11.68, y:0.18, w:1.28, h:0.58 });
}

function addHeader(slide, title, eyebrow, icon) {
  slide.addShape(pptx.ShapeType.roundRect, { x:0.62, y:0.58, w:0.62, h:0.62, rectRadius:0.12, fill:{color:C.blue}, line:{color:C.blue} });
  slide.addText(icon, { x:0.78, y:0.73, w:0.3, h:0.18, fontFace:'Segoe UI Symbol', fontSize:24, color:'FFFFFF', align:'center', margin:0 });
  slide.addText(eyebrow, { x:1.45, y:0.62, w:2.4, h:0.18, fontSize:9, bold:true, color:C.blue, margin:0 });
  slide.addText(title, { x:1.45, y:0.82, w:9.5, h:0.48, fontSize:24, bold:true, color:C.navy, margin:0 });
}

function addBullets(slide, bullets) {
  const left = bullets.slice(0,3);
  const right = bullets.slice(3,6);
  const cols = [left, right];
  cols.forEach((col, idx) => {
    const x = idx === 0 ? 0.7 : 6.75;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y:1.55, w:5.85, h:4.95, rectRadius:0.14,
      fill:{color: idx===0 ? 'FFFFFF' : 'F4FAFE'}, line:{color:C.border, pt:1}
    });
    const runs = [];
    col.forEach(b => {
      runs.push({ text:b, options:{ bullet:{ indent:14 }, hanging:3, breakLine:true } });
    });
    if (!runs.length) runs.push({ text:'', options:{} });
    slide.addText(runs, {
      x:x+0.28, y:1.85, w:5.2, h:4.25,
      fontSize:18, color:C.text, breakLine:false, valign:'top', paraSpaceAfterPt:14,
      margin:0.02
    });
  });
}

const icons = {
  1:'✦',2:'💡',3:'⚠',4:'✦',5:'◎',6:'★',7:'☰',8:'📘',9:'◈',10:'🗄',11:'⌘',12:'☞',13:'◉',14:'📈',15:'🧪',16:'🖥',17:'▣',18:'⚙',19:'🌐',20:'⇄',21:'✓',22:'✦'
};

slides.forEach((item, idx) => {
  const s = pptx.addSlide();
  addBg(s, idx + 1);
  const lines = item.lines || [];
  const title = lines[0] || `Slide ${idx+1}`;

  if (idx === 0) {
    s.addShape(pptx.ShapeType.ellipse, { x:9.6, y:-0.2, w:3.1, h:3.1, fill:{color:'CDEFFF', transparency:18}, line:{color:'CDEFFF', transparency:100} });
    s.addShape(pptx.ShapeType.ellipse, { x:-0.5, y:5.8, w:2.4, h:2.4, fill:{color:'E5D9FF', transparency:22}, line:{color:'E5D9FF', transparency:100} });
    s.addShape(pptx.ShapeType.roundRect, { x:0.72, y:1.55, w:9.3, h:3.35, rectRadius:0.16, fill:{color:'FFFFFF', transparency:15}, line:{color:'FFFFFF', transparency:60} });
    s.addText('Master Thesis Presentation', { x:1.0, y:1.88, w:2.55, h:0.3, fontSize:11, bold:true, color:'0679B9', fill:{color:'E7F6FE'}, margin:0.08, shape:pptx.ShapeType.roundRect, radius:0.08 });
    s.addText(title, { x:1.0, y:2.28, w:8.3, h:1.15, fontSize:26, bold:true, color:C.navy, margin:0 });
    s.addText('Prepared by Odai Atef Atiya Abdelbaky', { x:1.0, y:3.65, w:5.8, h:0.28, fontSize:18, bold:true, color:'16344B', margin:0 });
    s.addText('Master of Science in Artificial Intelligence, College of Informatics, Midocean University', { x:1.0, y:4.02, w:7.8, h:0.3, fontSize:15, color:'486173', margin:0 });
    s.addText('Supervisor: Dr. Ashraf Alsaed', { x:1.0, y:4.34, w:3.4, h:0.25, fontSize:15, bold:true, color:'486173', margin:0 });
  } else if (idx === 10) {
    addHeader(s, 'End-to-End Recommendation Framework', 'System Architecture', icons[item.slide]);
    const boxes = [
      ['Chrome Extension','Overlay labels, post capture, explicit feedback'],
      ['Backend API','Validation, training trigger, inference requests'],
      ['MySQL Storage','Posts, labels, users, recommendation data'],
      ['LoRA Model','Personalized recommendation scoring on user data']
    ];
    const xs = [0.6, 3.3, 6.05, 8.8];
    boxes.forEach((b, i) => {
      s.addShape(pptx.ShapeType.roundRect, { x:xs[i], y:2.6, w:2.05, h:2.1, rectRadius:0.12, fill:{color:'FFFFFF'}, line:{color:C.border, pt:1.2} });
      s.addText(b[0], { x:xs[i]+0.18, y:3.0, w:1.7, h:0.45, fontSize:18, bold:true, color:C.navy, align:'center', valign:'mid', margin:0 });
      s.addText(b[1], { x:xs[i]+0.16, y:3.55, w:1.72, h:0.75, fontSize:11, color:C.text, align:'center', valign:'mid', margin:0.02 });
      if (i < boxes.length-1) s.addText('→', { x:xs[i]+2.18, y:3.32, w:0.38, h:0.3, fontSize:26, bold:true, color:'73AEDA', align:'center', margin:0 });
    });
    s.addText('Transparent, explicit, and privacy-aware recommendation pipeline', { x:0.72, y:5.55, w:6.3, h:0.28, fontSize:16, bold:true, color:'42637F', margin:0 });
  } else if (idx === 19) {
    addHeader(s, title, 'Data Movement', icons[item.slide]);
    const boxes = [
      ['Social Platform','Visible posts and user actions'],
      ['Extension','Extracts content and collects labels'],
      ['Backend API','Processes data and serves model actions'],
      ['MySQL','Stores labeled posts and results']
    ];
    const xs = [0.45, 3.25, 6.05, 8.85];
    boxes.forEach((b, i) => {
      s.addShape(pptx.ShapeType.roundRect, { x:xs[i], y:2.85, w:2.1, h:1.75, rectRadius:0.12, fill:{color:'FFFFFF'}, line:{color:C.border, pt:1.2} });
      s.addText(b[0], { x:xs[i]+0.18, y:3.18, w:1.72, h:0.35, fontSize:17, bold:true, color:C.navy, align:'center', margin:0 });
      s.addText(b[1], { x:xs[i]+0.15, y:3.62, w:1.78, h:0.55, fontSize:11, color:C.text, align:'center', margin:0.02 });
      if (i < boxes.length-1) s.addText('→', { x:xs[i]+2.2, y:3.44, w:0.3, h:0.22, fontSize:26, bold:true, color:'73AEDA', align:'center', margin:0 });
    });
  } else if (idx === 21) {
    addHeader(s, title, 'Closing', icons[item.slide]);
    const demos = ['Extension Interaction','Labeling Posts','API & Database Flow','Recommendation Output'];
    const pos = [[0.85,2.2],[4.1,2.2],[0.85,4.2],[4.1,4.2]];
    demos.forEach((d,i) => {
      s.addShape(pptx.ShapeType.roundRect, { x:pos[i][0], y:pos[i][1], w:2.85, h:1.2, rectRadius:0.12, fill:{color:'FFFFFF'}, line:{color:C.border, pt:1} });
      s.addText(d, { x:pos[i][0]+0.2, y:pos[i][1]+0.38, w:2.45, h:0.3, fontSize:16, bold:true, color:C.navy, align:'center', margin:0 });
    });
    s.addText('Presenter: Odai Abdelbaky', { x:0.9, y:5.95, w:2.8, h:0.22, fontSize:15, bold:true, color:'36526A', margin:0 });
    s.addText('Thank you', { x:8.0, y:5.55, w:2.8, h:0.55, fontSize:28, bold:true, color:C.navy, margin:0, align:'center' });
  } else {
    addHeader(s, title, `Slide ${String(item.slide).padStart(2,'0')}`, icons[item.slide] || '•');
    const joined = (lines.slice(1).join(' ') || '').split('. ').map(x => x.trim()).filter(Boolean).slice(0,6).map(x => x.endsWith('.') ? x : x + '.');
    addBullets(s, joined);
  }
});

pptx.writeFile({ fileName: path.join(__dirname, 'thesis_redesigned.pptx') });
