/**
 * 博客访问量统计工具 (基于 CountAPI)
 * 提供稳定的云端计数服务
 */

const NAMESPACE = 'rcpawn-blog';
const BASE_URL = 'https://api.countapi.xyz';

// 记录一次访问（PV）并返回最新值
export const hit = async (key) => {
  try {
    const url = `${BASE_URL}/hit/${NAMESPACE}/${key}`;
    console.log('Counter hit:', url);
    const res = await fetch(url);
    console.log('Counter response status:', res.status);
    const data = await res.json();
    console.log('Counter hit result:', data);
    return data.value || 0;
  } catch (e) {
    console.error('Counter hit failed:', key, e);
    return 0;
  }
};

// 获取当前数值（不增加计数）
export const get = async (key) => {
  try {
    const url = `${BASE_URL}/get/${NAMESPACE}/${key}`;
    console.log('Counter get:', url);
    const res = await fetch(url);
    console.log('Counter response status:', res.status);
    const data = await res.json();
    console.log('Counter get result:', data);
    return data.value || 0;
  } catch (e) {
    console.error('Counter get failed:', key, e);
    return 0;
  }
};
