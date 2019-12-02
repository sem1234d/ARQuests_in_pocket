import React from "react";

class SolvedPlace extends React.Component{
    render(){
    return(
        <React.Fragment>
        {this.props.visibility?<div className={"information_"+this.props.visibility}  onClick={this.props.onClick}>
        <div className="placeName">
    {this.props.place}
        </div>
    </div>:<div className={"information_"+this.props.visibility}  >
    <div className="placeName">
{this.props.place}
    </div>
</div>}</React.Fragment>



    );
    }
}
export default SolvedPlace;