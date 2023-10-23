"use client"

import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from './list.module.scss'
import { useInView } from 'react-intersection-observer'
import { myContext } from '../Context'
import axios from 'axios'
import imgname from '/public/list.json'
import Detail from '../detail/Detail'
import { useSearchParams } from 'next/navigation';


function List() {
  const { memberData, setMemberData, contentsData, setContentsData, fNum, setFNum , sessData, loginCk} = useContext(myContext);
  const menu = ['과일류', '채소류', '수산물', '축산물', '버섯', '곡물/가공류']
  const [lover_list, setLover_list] = useState([]);
  let data01 = contentsData.filter((obj) => (obj.product_cls_code === "01"))
  const { ref, inView } = useInView();
  const [data_list, setData_list] = useState([]);
  const paramsData = useSearchParams();
  const tabName = paramsData.get("tab");
  const [tap, setTap] = useState(tabName);
  const [dItem, setDitem] = useState();

  const [detailon , setDetailon] = useState(false);

  const elSInput = useRef();


  const [searchV, setSearchV] = useState("");

  // 입력란 값이 변경될 때 호출되는 이벤트 핸들러



  const checked = async (name) => {
    const id = sessData.id;

    if (lover_list.includes(name)) {
      let a;
      fNum.map((v) => {
        if (v.name == name) a = v.num
      })

      const d = await axios.delete(`/api/favorite?id=${id}&num=${a}`)
      console.log(a);
      setFNum(d.data)

    } else {
      const a = await axios.post(`/api/favorite`, { id, name });
      setFNum(a.data)

    }
  }



  const tap_click = (v) => {
    setTap(v);
    console.log(elSInput.current.value)

    switch (v) {
      case '과일류':
        return setData_list(data01.filter((obj) => (obj.category_name === "과일류")));
      case '채소류':
        return setData_list(data01.filter((obj) => (obj.category_name === "채소류")));
      case '수산물':
        return setData_list(data01.filter((obj) => (obj.category_name === "수산물")));
      case '축산물':
        return setData_list(data01.filter((obj) => (obj.category_name === "축산물")));
      case '버섯':
        return setData_list(data01.filter((obj) => (obj.category_name === "특용작물")));
      case '곡물/가공류':
        return setData_list(data01.filter((obj) => (obj.category_name === "식량작물")));
      case "검색" : 
        return setData_list(data01.filter((obj) => obj.item_name.toLowerCase().includes(elSInput.current.value.toLowerCase())));
    }
  }

  useEffect(() => {
    setData_list(data01.filter((obj) => (obj.category_name === "과일류")))

  }, [contentsData])

  useEffect(()=>{

    tap_click(tabName)

  },[contentsData])

  useEffect(() => {
    setLover_list(fNum.map((v)=>(v.name)))
    console.log(lover_list)
  }, [fNum])

  return (
    <section>
      <h2 className={styles.header}>장보는날</h2>

      <div ref={ref} className={styles.tap}>
        <ul>
          {menu.map((v, k) => (
            <li key={k} onClick={() => { tap_click(v) }} className={`${tap == v ? styles.on : ""}`}>{v}</li>
          ))
          }
        </ul>
      </div>

      <div className={styles.con}>
        <div className={`${!inView ? styles.on : ""} ${styles.input_sub} `}>
          <div className={styles.input}>
            <label>
              <input ref={elSInput} onChange={()=>{tap_click("검색"), console.log()}} type='text'></input><span><img src='/asset/sch.svg'></img></span>
            </label>
          </div>
        </div>
        <div className={`fixed ${styles.top} ${!inView ? styles.on : ""}`} onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
          <p>Top</p>
        </div>

        <div className={styles.input}>
          <label>
            <input type='text'></input><span><img src='/asset/sch.svg'></img></span>
          </label>
        </div>

        <div className={styles.list}>
          <ul>
            {
              data_list.map((v) => (
                <li key={v.num} onClick={() => { setDitem(v) ; setDetailon(true) }}>
                  <figure>
                    <div>
                      <span onClick={() => { checked(v.item_name) }} className={`${lover_list.includes(v.item_name) ? styles.on : ""} ${styles.lover}`}></span>
                      <img src={`/asset/image/${imgname[v.item_name]}.png`} />
                    </div>
                    <figcaption>
                      <p>{v.item_name}</p>
                      <div><p>월평균 {v.dpr3.length == 0 ? "데이터가 없습니다" : `${v.product_cls_name}가 : ${v.dpr3}원`}</p></div>
                    </figcaption>
                  </figure>
                </li>
              ))

            }

          </ul>
        </div>
        {
          (detailon) ? (
            <div className={`${styles.pop} fixed`}>

              <Detail dItem={dItem} close={()=>setDetailon(false)}/>
            </div>
          ) : ""
        }
      </div>
    </section>
  )
}

export default List