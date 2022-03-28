/*
* Kemomimi Online Judge System - Queue Manager
*
* すること
*
* hqを監視して、タスクが終了した（成功したとは言っていない）ら
* バックエンドに終わったことを通知
*
* hqにリクエストを送って
* 成功したタスク一覧を取得して保存
* 5秒待つ
* 成功したタスク一覧を取得
* 保存した前のタスク一覧と比較して増えたタスクがあったら通知
* */

import axios from "axios";

const Sleep = (ms:number) => new Promise((resolve) => setTimeout(resolve, ms));

async function Manager(){
  const baaaa:Array<string> = [];
  let j = await axios.get("http://127.0.0.1:19900/job?status=success&reverse=true")
  let arr = j.data.jobs


  for (const i in arr){
    baaaa.push(arr[i].id);
  }

  await Sleep(1000);


  j = await axios.get("http://127.0.0.1:19900/job?status=success&reverse=true")
  const arr2 = j.data.jobs

  let baaaa2:Array<any> = [];
  for (const i in arr2){
    baaaa2.push(arr2[i].id);
  }
  const diff = getArraysDiff(baaaa,baaaa2)
  console.log(diff)
  // Todo: バックエンドのURL決め打ちやめる
  try {
    for (const j in diff){
      const res = await axios.get("http://127.0.0.1:19900/job/"+diff[j])
      console.log(res.data["output"])
      const r = await axios.put("http://localhost:3080/runs/"+ diff[j], res.data["output"],{
        headers: { "Content-Type": "application/json" },
      })
      console.log(r.data)
    }
  } catch (e) {
    console.log(e)
  }

  await Manager();

}

Manager();

const getArraysDiff = (array01:Array<string>, array02:Array<string>) => {
  const arr01 = [...new Set(array01)],
    arr02 = [...new Set(array02)];
  return [...arr01, ...arr02].filter(value => !arr01.includes(value) || !arr02.includes(value));

}
