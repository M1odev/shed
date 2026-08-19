import { useState, useEffect} from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/navbar";
import { Navigate } from 'react-router-dom';
import { Info } from 'lucide-react';
import { SquareCheck } from 'lucide-react';
import { SquareX } from 'lucide-react';
import { SquarePlus } from 'lucide-react';



function Items({onDurationChange, onItemsChange}){
    const [practiceItems,setPracticeItems] = useState([])
    const [makingItem, setMakingItem] = useState(true)

    const totalDuration = practiceItems.reduce(
    (total, item) => total + Number(item.duration),
    0)

 
    const renderItemsList = practiceItems.map(item => (
    <li className="practice-item" key={item.id}>
        <span>{item.name}</span>
        <span>{item.duration} min</span>
    </li>
    ))
    function addItem(e){
        e.preventDefault()
        
        const formData = new FormData(e.target)
        const newName = formData.get('name')
        const newDuration = formData.get('duration')

        setPracticeItems(practiceItems => [...practiceItems, {id: crypto.randomUUID(), name: newName, duration: newDuration}])



        e.target.reset()
    }

    useEffect(() => {
    onDurationChange(totalDuration);
    }, [totalDuration])

    useEffect(
        ()=>{
         onItemsChange(practiceItems)
        }, [practiceItems]
    )






    return <>

    <div className="div-container-inline" style={{display:"flex", width:"100%", justifyContent:"space-between"}}>
    <div style={{display:"flex", justifyContent:"space-between", gap:"5px"}}>
      <button onClick={()=>setMakingItem(true)} style={{maxWidth:"100px", borderColor: "transparent", backgroundColor:"transparent", marginTop:"15px"}}>
        <SquarePlus/>
      </button>

      {makingItem && (
        <div className="div-container-inline">
            <form onSubmit={addItem} style={{display:"flex", gap:"15px"}}>
                <input className="line-text"type="text" name="name"placeholder="Item Name" required/>
                <input className="line-text" type="number" name="duration" placeholder="Duration in Minutes" min="1" required/>
                <button className="icon-button"type="submit"> <SquareCheck/> </button>
            </form>
            <button className="icon-button"onClick={()=>setMakingItem(false)}><SquareX/></button>
        </div>)
      }
    </div>

    <div>
    
    <ul className="practice-items">
    {renderItemsList}
    </ul>
    </div>
    </div>

    
    
    </>

}




export default function Manual(){
    const [session,setSession] = useState({
        title:"",
        rating:5,
        duration:0,
        description:"",
        improved:false
    }
    );

    const [usingItems,SetUsingItems] = useState(true)
    const [itemDuration, setItemDuration] = useState(0)
    const [items,setItems] = useState([])
    const [loading, setLoading] = useState(false);
    const [redirectTo, setRedirectTo] = useState(null);
    const [viewingInfo, setViewingInfo] = useState(false);
    
    const finalDuration = usingItems ? itemDuration: session.duration

    if (redirectTo) {
        return <Navigate to={redirectTo} replace={true} />;
    }  

    async function submitSession() {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { data: sessionData, error } = await supabase
            .from('practice_sessions')
            .insert({
                user_id: user.id,
                title: session.title,
                duration: finalDuration,
                rating: session.rating,
                description: session.description,
                improved: session.improved
            })
            .select();
            console.log('data: ', sessionData);
            console.log('error ', error);

            if (usingItems){
                for ( let item in items){
                const {data:itemsData, error : itemsError} = await supabase
                .from('session_items')
                .insert({
                    session_id: sessionData[0].id,
                    item_name: items[item].name,
                    duration: items[item].duration,
                    position: item
                })
            }
        }

            if (!error) {
            setRedirectTo('/home');
            }


        }finally {
            setLoading(false);
        }
        }


    return (<>
    <Navbar/>


    <h1 style={{textAlign:"left"}}>Manual</h1>

    <div className="div-container-inline" >

    <div className="input-container" style={{width:"250px"}}>
        <label htmlFor='title-input'>Title</label>
        <input
        id="title-input"
        value={session.title}
        onChange={(e) => setSession({...session, title: e.target.value})}
        placeholder="First Practice Session"/>
    </div>

    <div className="input-container" style={{width:"125px"}}>
        <div style={{display:"inline-flex",gap:"4px"}}>
            <span>Session Rating:</span>
            <span>{session.rating}/10</span>
        </div>

         <input
        type="range"
        min="0"
        max="10"
        step="1"
        value={session.rating}
        onChange={(e) => setSession({...session, rating: Number(e.target.value)})}
        />
    </div>

    </div>

    <div className="div-container-inline" style={{justifyContent:"start", gap:"10px", alignItems:"flex-start"}}>

     <label className="switch">
        <input type="checkbox" checked={usingItems} onChange={()=>SetUsingItems(!usingItems)}/>
        <span className="slider">
        <span>Duration</span>
        <span>Items</span>
        </span>
    </label>

     <button onClick={() => setViewingInfo(!viewingInfo)} style={{backgroundColor:"transparent", borderColor:"transparent"}}><Info/></button>
    {viewingInfo && 
    (<textarea readOnly style={{width: "250px", height:"60px", resize:"none", outline:"none"}}>
    Items allows you to break your practice into specific tasks you did during the session instead of simply an overall time. 
    </textarea>)}
    </div>

    <div className="div-container-inline">
        { usingItems ?
         (<Items onDurationChange={setItemDuration} onItemsChange={setItems}/>) : 
         (<div className="input-container">
         <label htmlFor="duration_input">Duration</label>
         <input
        type="number"
        id="duration_input"
        min="1"
        value={session.duration}
        onChange={(e) =>
        setSession({...session, duration: Number(e.target.value)})
        }
        />
        </div>)
        }  
    </div>


    <div className="div-container-inline">

    <div className="input-container">
    <label htmlFor="description">Description (optional)</label>
    <textarea id='description' placeholder="Worked on some audition material for orchestra" value={session.description} onChange={(e) => setSession({...session, description: e.target.value})} style={{width:"350px", height:"75px"}}></textarea>
    </div>

    <div>
        <label htmlFor="improved">Did you get at least 1% better?</label>
        <input id="improved" type="checkbox" checked={session.improved} onChange={() => setSession(prev => ({...prev, improved: !prev.improved}))
}/>
    </div>

    </div>

    <button 
    onClick={submitSession} 
    disabled={loading}
    style={{ width: "250px", marginTop: "30px", opacity: loading ? 0.6 : 1 }}
    >
    {loading ? "Saving..." : "Save"}
    </button>



    
    
    
    </>)

}