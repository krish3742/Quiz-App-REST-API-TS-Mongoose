function Option(props) {
    let option = props.option; 
    for(let i = 1; i <= option; option++) {

        return (
            <>
                <div>{i}: </div>
                <input type='text' placeholder='Enter option'></input>
                <button onClick={props.handleAddOptionClick}>Add Option</button>
            </>
        )
    }
}

export default Option;