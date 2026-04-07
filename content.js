// 内容脚本用于页面元素的处理
console.log("内容脚本加载");

// 页面加载完成时执行
document.addEventListener('DOMContentLoaded', () => {
  console.log("网页DOM加载完成");
});

// 页面准备就绪时的备用机制
window.addEventListener('load', () => {
  console.log("网页加载完成");
});