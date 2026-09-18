const https=require('https'),fs=require('fs'),path=require('path');
const dir=path.join(process.cwd(),'xhs_eng_0918');fs.mkdirSync(dir,{recursive:true});
const urls=[
"https://sns-webpic-qc.xhscdn.com/202609181505/28978bc8fb9cfbaa8113ca91aabcfa6e/1040g0083236m1qie7a705qh8uo2g8r009klur28!nd_dft_wlteh_webp_3",
"https://sns-webpic-qc.xhscdn.com/202609181505/2ce0aaa9386fea3f69e470f578abf463/1040g00832370ma0dg24g5qh8uo2g8r0003g7coo!nd_dft_wlteh_webp_3",
"https://sns-webpic-qc.xhscdn.com/202609181505/c6e78b456d59fcecb31f3bce412faa90/1040g00832370ma0dg2305qh8uo2g8r00oohpv0o!nd_dft_wlteh_webp_3",
"https://sns-webpic-qc.xhscdn.com/202609181505/2e85c0d370a481528b650f067ae60bd5/1040g00832370ma0dg2405qh8uo2g8r00rv1gvh0!nd_dft_wlteh_webp_3",
"https://sns-webpic-qc.xhscdn.com/202609181505/520e5d419c04fbde15476e443e9753d7/1040g00832370ma0dg2505qh8uo2g8r00fh8ej0g!nd_dft_wlteh_webp_3",
"https://sns-webpic-qc.xhscdn.com/202609181505/09c3428b4d78dc27038b7c2db3201835/1040g00832370ma0dg25g5qh8uo2g8r00itl77n0!nd_dft_wlteh_webp_3",
"https://sns-webpic-qc.xhscdn.com/202609181505/94aecc6ba6243dfa56456b7a18e7881b/1040g00832370ma0dg2605qh8uo2g8r00auk0308!nd_dft_wlteh_webp_3",
"https://sns-webpic-qc.xhscdn.com/202609181505/f0b62be5c4c0c7362cd47c2a0f46d615/1040g00832370ma0dg26g5qh8uo2g8r00qhr3jgo!nd_dft_wlteh_webp_3"
];
function get(u){return new Promise((res,rej)=>{https.get(u,{headers:{'Referer':'https://www.xiaohongshu.com/','User-Agent':'Mozilla/5.0'}},r=>{if(r.statusCode!==200){r.resume();return rej(new Error('HTTP '+r.statusCode))}const c=[];r.on('data',x=>c.push(x));r.on('end',()=>res(Buffer.concat(c)))}).on('error',rej)})}
(async()=>{for(let i=0;i<urls.length;i++){try{const b=await get(urls[i]);fs.writeFileSync(path.join(dir,String(i+1).padStart(2,'0')+'.webp'),b);console.log('ok',i+1,b.length)}catch(e){console.log('fail',i+1,e.message)}}console.log('DONE')})();
