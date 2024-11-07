const axios = require('axios')
require('dotenv').config();
//the map is 11 by 11
const apiEndpoint = 'https://challenge.crossmint.io/api'
const candidateId = process.env.CANDIDATE_ID


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// gets the astral object map position from the helper api and parses through to get indexes and returns an array of arrays
const getPositions = async(astralObject) =>{
    try{
        let response = await fetch(`${apiEndpoint}/map/${candidateId}/goal`)
        let data = await response.json()
        
        if(!data.goal){
            throw new Error("There is no goal data")
        }

       let positions = data.goal.reduce((finalArray,current,xIndex)=>{
            for(let yIndex in current){
                if(astralObject === current[yIndex]){
                    finalArray.push([xIndex,yIndex])
                }
            }
            return finalArray
        },[])  

        return positions

    }catch(error){
        console.log(error.message)
    }
}



//sets the astral positions by making post request with the positions
 export async function setPolyanets(positionsArray){  
     for(let position of positionsArray){
        let [row,column] = position
         await delay(8000) //delay when request are sent out
         try{
            await axios.post(`${apiEndpoint}/polyanets`,{row,column,candidateId})
         }catch(error){
            console.error("error adding polyanet", error.message)
        }
    }

       console.log("Object positions successfully added")

}


getPositions("POLYANET")
.then(data => setPolyanets(data))