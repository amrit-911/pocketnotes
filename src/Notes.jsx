import React, { useEffect, useRef, useState }  from 'react'
import styles from './Notes.module.css'
import uuid from "react-uuid";
import moment from 'moment/moment';
import deleteIcon from './deleteIcon.png'
import send from './send.png'
import nextIcon from './next.png'
import backIcon from './back.png'

export default function Sidebar() {
  const [trigger,setTrigger] = useState(false)
  const [newNotes,setNewNotes] = useState({title:"",color:""})
  const [notes,setNotes] = useState(localStorage.notes ? JSON.parse(localStorage.notes):[])
  const [isActive,setIsActive] = useState(false)
  const [selectedNote, setSelectedNote] =useState()
  const [newContent,setNewContent] = useState()
  const [currentDate,setCurrentDate] = useState()
  const notesGoesBottom = useRef()
  const [showSidebar,setShowSidebar] = useState(true)
 
useEffect(()=>{
  localStorage.setItem("notes", JSON.stringify(notes))
},[notes])

useEffect(() => {

notesGoesBottom.current?.scrollIntoView()

}, [selectedNote])


  function clickTrigger(){
    setTrigger(true)
  }

  const inputChange = (e) =>{
      setNewNotes({ ...newNotes, title:e.target.value})
  }
  const colorClicked =(e)=>{
      setNewNotes({...newNotes, id:uuid() , color:e.target.value,content:[], date:[] })
  }
  const createNew = () =>{
    console.log("blank: ",newNotes.title)
    if(newNotes.title.replace(/\s/g, "").length>0 && newNotes.color.length>0){
      console.log("added")
      setNotes([newNotes, ...notes])
      console.log("newNotes: ",newNotes)
      setNewNotes({...newNotes,title:"", color:""})
      setTrigger(false)
    }
    
  }
  const clickDelete = (deleteId) =>{
    setNotes(notes.filter((item )=>item.id !== deleteId ))
  }

useEffect(() => {
  setSelectedNote(notes.find((item) => item.id === isActive))
}, [notes,isActive])

const isClicked = (item,index)=>{
  setIsActive(item.id)
  console.log(index)
 
}
 
const contentChange = (e)=>{
  setNewContent( e.target.value)
  setCurrentDate(moment().format('h:mm:ss a Do  MMMM YYYY'))
  console.log(currentDate)
}
 
function sendClick(){
  if(newContent.replace(/\s/g, "").length>0){
    console.log(selectedNote)
    const updatedNotesArray = notes.map((item) =>{
      if(item.id === isActive){
        setSelectedNote({...selectedNote,content:[...newContent],date:[...currentDate] })

        setNewContent("")
        return {
          id: selectedNote.id,
          title: selectedNote.title,
          color: selectedNote.color,
          content: [...selectedNote.content, newContent],
          date:[...selectedNote.date,currentDate]
        }
      }
        return item 
    }
    
     )
     setNotes(updatedNotesArray)
  }else{
  setNewContent("")
  }
}

console.log("notes: ",notes)
console.log("selectedNote", selectedNote)
return ( <>
    <div className={styles.container}>

{/*sidebar  */}
{showSidebar?
      <div className={styles.sidebar_container}>
        <div style={{display:"flex"}} >
          <div className={styles.brand}>Pocket Notes</div>
          {showSidebar?<button className={styles.mobile_open_sidebar} style={{position:"absolute",right:"20px",top:"15px"}} onClick={()=>setShowSidebar(false)}><img src={backIcon} alt="backIcon"/></button>:""}
        </div>
        <button className={styles.sidebar_create_button} onClick={clickTrigger}>+ Create</button>
        
        <div className={styles.group}>
        {notes.map((item,index)=>
         <div>
          <div className={`${styles.group_div} ${item.id === isActive && styles.active} `}   onClick={()=>isClicked(item,index)} key={index} >
            <div className={styles.group_profile} style={{background:`${item.color}`}}>{item.title.substr(0,2).toUpperCase()}</div>
            <div className={styles.group_title} >{item.title}</div>
            <div style={{width:"50px",height:"40px"}}></div>
          </div>
          <div className={styles.delete_div}>
          <button className={styles.delete} onClick={()=>clickDelete(item.id)}><img src={deleteIcon} alt="deleteIcon" /></button>
         </div>
         </div>
        )}
        </div>
      </div>:""}

{/* main */}
        <div className={showSidebar? styles.main_container: styles.mobile_main_container }>
          {/* Main title bar */}
        {selectedNote?<div className={styles.main_title_div}>
            {showSidebar?"":<button className={styles.mobile_open_sidebar} onClick={()=>setShowSidebar(true)}><img src={nextIcon} alt="nextIcon"/></button>}
            <div className={styles.group_profile} style={{background:`${selectedNote.color}` }}>{selectedNote.title.substr(0,2).toUpperCase()}</div>
            <div className={styles.main_title}>{selectedNote.title}</div>
            </div>:
            <div className={styles.main_title_div}>
            {showSidebar?"":<button className={styles.mobile_open_sidebar} onClick={()=>setShowSidebar(true)}><img src={nextIcon} alt="nextIcon"/></button>}
            </div> 
        }

        {/* main content */}
            {selectedNote? 
             
              <div  className={styles.main_content}>
                <div className={styles.main_content_div}>
              {selectedNote.content.map((item,key)=>(
              <div  className={styles.content_div}>
                <div className={styles.content_date}  >{selectedNote.date[key]}</div>
                <div className={styles.content_body} >{item}</div>
              </div>)              
              )}
               
              </div>
              <div ref={notesGoesBottom}  />
              </div>
             
            : <div className={styles.main_empty}>
                <div>Create New Notes</div>
              </div> }

          {/* TextArea */}
          {selectedNote?
          <div className={styles.textarea_div}>
           <textarea value={newContent} onChange={contentChange} placeholder="Enter your text here..." onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            sendClick()}
                    }} ></textarea>
                    <button className={styles.send} onClick={sendClick} ><img src={send} alt="" /></button>
          
           </div>:
           <div className={styles.textarea_div}>
           <textarea  maxLength="0" ></textarea>
           <button className={styles.send} onClick={sendClick} ><img src={send} alt="" /></button>
           </div>}
        </div>

      </div>


{/* popop */}
    {(trigger)?
    <div>
        <div className={styles.container_popup}>
          
            <div className={styles.inner_container_popup}>
            <div className={styles.popup_name}>
              <h2 >Create New Notes</h2>
              <button onClick={()=>{setTrigger(false)
                setNewNotes({...newNotes,title:"", color:""})}}>X</button>
            </div>
              <div className={styles.group_name}>
                <label>Group Name</label>
                <input type="text" onChange={inputChange} maxLength="20" placeholder="Enter your group name..."/>
              </div>
            <div className={styles.color_choice}>
                <div style={{display:"inline"}}>Choose color</div>  
                <button value={"#B38BFA"} className={styles.color_button}  style={{background:"#B38BFA"}} onClick={colorClicked}> </button>
                <button  value={"#FF79F2"}  className={styles.color_button} style={{background:"#FF79F2"}} onClick={colorClicked}> </button> 
                <button value={"#43E6FC"} className={styles.color_button}  style={{background:"#43E6FC"}} onClick={colorClicked}> </button>
                <button  value={"#F19576"} className={styles.color_button}  style={{background:"#F19576"}} onClick={colorClicked}> </button>
                <button  value={"#0047FF"}  className={styles.color_button} style={{background:"#0047FF"}} onClick={colorClicked}> </button>
                <button  value={"#6691FF"} className={styles.color_button}  style={{background:"#6691FF"}} onClick={colorClicked}> </button>
            </div>
            <button className={styles.create_popup} onClick={createNew}>Create</button>
        </div>  
        </div>
    </div>:""}</>
  )
}
