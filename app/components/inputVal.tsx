type Props = {
    labelMsg: string
    defaultVal: number
    elementName: string
    handleEvent: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function InputVal({labelMsg, defaultVal, elementName, handleEvent}: Props){
    return (
        <label className="text-1xl font-bold">
            {labelMsg}
            <input className="border bg-white rounded-lg text-center w-1/2" type="number" defaultValue={defaultVal} name={elementName} onChange={handleEvent}></input>
        </label>
    )
}

export default InputVal