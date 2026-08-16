import { useState} from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/navbar";
import { Navigate } from 'react-router-dom';








export default function Manual(){
    const [session,setSession] = useState({
        title:"",
        rating:5,
        duration:0,
        description:"",
        improved:false
    }
    );

    const [loading, setLoading] = useState(false);
    const [redirectTo, setRedirectTo] = useState(null);

    if (redirectTo) {
        return <Navigate to={redirectTo} replace={true} />;
    }  

    async function submitSession() {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { data, error } = await supabase
            .from('practice_sessions')
            .insert({
                user_id: user.id,
                title: session.title,
                duration: session.duration,
                rating: session.rating,
                description: session.description,
                improved: session.improved
            })
            .select();
            console.log('data: ', data);
            console.log('error ', error);

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


    <div className="div-container-inline">

    <div className="input-container">
    <label htmlFor="description">Description (optional)</label>
    <textarea id='description' placeholder="Worked on some audition material for orchestra" value={session.description} onChange={(e) => setSession({...session, description: e.target.value})}></textarea>
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