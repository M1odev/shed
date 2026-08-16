import {useState} from "react";
import { supabase } from "../lib/supabase";
import {useNavigate} from "react-router-dom";

async function checkIndividuality(username){
   const { data, error} = await supabase
  .from("profiles")
  .select("username")
  .eq("username", username)
  .maybeSingle();

  if (error) throw error;
  return data !== null;

}



export default function  Onboarding(){
    const [userName,setUser] = useState('')
    const [userError, setUserError] = useState('')

    const [display,setDisplay] = useState('')

    const navigate = useNavigate()

    async function submitProfile(){
        const{data:{user}, getUserError} = await supabase.auth.getUser()
        console.log(getUserError)
        const {data,error} = await supabase
        .from('profiles')
        .update({username:userName, display_name:display, onboarding_completed:true})
        .eq('id',user.id)
        .select()

        if (error){
            console.error(error)
            setUserError(error.message)
            return
        }

        console.log("updated profile")
        navigate("/home")
    }

    function CheckFeedback(){
         if (userError == 'success'){
            return <p className="text-success">Username avaliable</p>
         }else if(userError){
            return <p className="error-message">{userError}</p>
         }else{
           return null 
         }
    }

    async function checkUsername(e)  {
        const username = e.target.value.trim().toLowerCase();
        if (!username.trim()){
            setUserError("Please enter a username.")
            return
        }

        try{
        const exists = await checkIndividuality(username);

        if (exists) {
            setUserError("Username is already taken.");
        }else if(username.length < 3){
            setUserError("Username must be at least 3 characters")
        }
        else{
            setUserError("success")
        }
    } catch(error){
        setUserError("Couldn't check username. Please wait and then try again.")
        console.error(error)
    }
};






    return (
    <>
    <div className ="inline-container">
      <div>
      <h2>Create a username</h2> 
      <p>This should be unique so your friends can find you</p>
      </div>
      <input type ="text" className = "line-input" value={userName} onChange={ (e) => {setUser(e.target.value);
        setUserError("")}}
      onBlur={(e) => checkUsername(e)} />
      <CheckFeedback/>
    </div>
    <div className="inline-container">
        <div>
        <h2>Choose a display name</h2>
        <p>This will show up on the leaderboard and in session posts</p>
        </div>
        <input type="text" className="line-input" value={display} onChange={(e) => {setDisplay(e.target.value)}}/>
        
    </div>
    <button className="btn-insert" onClick={submitProfile}disabled={userError !== "" && userError !== "success"}>{(userError !== "" && userError !== "success") ? "Username Error": "Continue"}</button>
    </>
    )
}