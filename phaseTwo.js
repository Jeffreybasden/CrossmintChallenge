const axios = require('axios')
require('dotenv').config();
const apiEndpoint = 'https://challenge.crossmint.io/api'
const candidateId = process.env.CANDIDATE_ID

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getPositionsAndParseData = async() =>{ // calls api and parse all information to get data ready to be sent to server
    try{

        let response = await fetch(`${apiEndpoint}/map/${candidateId}/goal`)
        let data = await response.json()
        
        if(!data.goal){
            throw new Error("There is no goal data")
        }
        
        let positionData = data.goal.reduce((final,current,xIndex)=>{ //parse the data to form an object with key of astral object and value of array of positions and attributes
            for(let yIndex in current){
                let astralObject = current[yIndex]
                if(astralObject === "POLYANET"){
                    final.polyanets.push([xIndex,yIndex])
                }else if(astralObject.includes('_')){ 
                    let prefix = astralObject.split('_')[0].toLowerCase()
                    
                    switch(astralObject.split('_')[1]){
                        case 'SOLOON':
                            final.soloons.push([xIndex,yIndex,prefix])
                            break
                        case "COMETH":
                            
                            final.comeths.push([xIndex,yIndex,prefix])
                            break
                    }
                }
            }
            
            return final

        },{ comeths:[],soloons:[],polyanets:[]}) // initialize the object 

        
        return positionData

    }catch(error){
        console.log(error)
    }
}


async function setAstralObjectsPositions(positionsObj){

   let keys = Object.keys(positionsObj) //get astral object names since they are the keys of the positions object

    for(let astralObject of keys){ //loop through keys

        let positionsArray = positionsObj[astralObject]

        if(astralObject === 'polyanets'){
            for(let position of positionsArray){
                let [row,column] = position
                try{
                    await delay(5000)
                    await axios.post(`${apiEndpoint}/polyanets`,{row,column,candidateId})
                }catch(error){
                    console.log('error setting polyanets', error.message)
                }
            }
        }else if(astralObject === 'comeths'){
            for(let position of positionsArray){
                let [row,column,direction] = position
                try{
                    await delay(5000)
                    await axios.post(`${apiEndpoint}/comeths`,{row,column,direction,candidateId})
                }catch(error){
                    console.log('error setting comeths', error.message)
                }
            }
        }else{
            for(let position of positionsArray){
                let [row,column,color] = position
                try{
                    await delay(5000)
                    await axios.post(`${apiEndpoint}/soloons`,{row,column,color,candidateId})
                }catch(error){
                    console.log('error setting soloons', error.message)
                }
            }   

        }
    }

    console.log('successfully added all data to the map! :)')
}
getPositionsAndParseData()
.then(data=> setAstralObjectsPositions(data))

