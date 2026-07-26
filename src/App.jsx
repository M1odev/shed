import './index.css'
import { useEffect, useState } from 'react'
import {supabase} from './lib/supabase'



export default function App() {

  const[sessions,setSessions] = useState([])

  useEffect(() => {
    
    async function getSessions(){
      const {data, error} = await supabase
        .from('practice_sessions')
        .select()

      console.log(data)
      console.log(error)

      setSessions(data)

    }

    getSessions()



  }, [])
}


