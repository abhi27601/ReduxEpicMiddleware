import  React from "react";
import { connect } from "react-redux";
import {BeersList} from "./BeersList";
import {search,cancel,random} from "../reducers/beersActions";
import {setConfig} from "../reducers/configActions"
export function Beers(props) {
  const {data,messages, status, search,cancel,config,setConfig , random} = props;
  return (
    <>
       <div className="App-inputs">
                {/* <button type="button" onClick={fetchData} disabled={status === "pending"}>
                    Fetch Beers!
                </button>*/}
               
                 <select
                    name="per-page"
                    defaultValue={config.perPage}
                    onChange={(e) => setConfig({perPage: Number(e.target.value)})}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => {
                        return <option key={value} value={value}>{value} results</option>
                    })}
                </select>
                <button type='button' onClick ={random}>Random</button>
                <input type="text" placeholder="Search Text"
                onChange={(e)=> search(e.target.value)}

                />
                 {status === "pending" && (
                    <>
                    <button type='button' onClick={cancel}>Cancel</button>
                    <span className="App-spinner">
                        <img src={"/ajax-loader.gif"} />
                    </span>
                    </>
                )} 
            </div>
            {status === "success" && (
                <div className="App-content">
                    <BeersList beers={data}/>
                </div>
            )}
            {status === "failure" && (
                <div className="App-content">
                    <p>!! Oops {messages[0].text}</p>
                </div>
            )}

    </>
  )
  
}

function mapState(state) {
    return {
        ...state.beers,
        config:state.config
    }
}

export default connect(mapState,{search,cancel,setConfig,random})(Beers)