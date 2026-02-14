type Props = {
    labelMsg: string;
    defaultVal: number;
    elementName: string;
    step: number;
    handleEvent: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputVal({labelMsg, defaultVal, elementName,step, handleEvent}: Props){
    return (
        <label className="text-1xl font-bold">
            {labelMsg}
            <input className="border bg-white rounded-lg text-center w-1/2" type="number" step={step}
             defaultValue={defaultVal} name={elementName} onChange={handleEvent}></input>
        </label>
    )
}

export default InputVal