import { useState } from 'react'
import { signUp, signIn } from './lib/auth'




export default function Auth(){

  const [loading,setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password,setPassword] = useState('')


  
  const handleSubmit = async (event) => {
  event.preventDefault()
  
  setLoading(true)
  try{
    const{signInData, error:signInError} = await signIn(email,password)
    if (!signInError){
      console.log("signed in")
      return
    }
    
    const{signUpData, error: signUpError} = await signUp(email, password)
    if (!signUpError){
      console.log("Signed up")
      return
    }

    alert(signUpError.message)
    alert(signInError.message)
  } finally{
    setLoading(false)
  }


}

    

    

  







    return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">Supabase + React</h1>
        <p className="description">Create an Account with email and password below</p>
        <form className="form-widget" onSubmit={handleSubmit}>
          <div>
            <input
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
            className = "inputField"
            type="password"
            placeholder="password"
            value={password}
            required={true}
            onChange={(e) => setPassword(e.target.value)}
            />

          </div>
          <div>
            <button className={'button block'} disabled={loading}>
              {loading ? <span>Loading</span> : <span>Create Account</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )










}