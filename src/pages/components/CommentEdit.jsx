export default function commentEdit(props) {
    return (
        <>
            <div>
                <textarea className="textarea textarea-bordered w-full" placeholder="Seu comentário..."></textarea>
            </div>
            
            <div className="flex justify-evenly">
                <button className="btn btn-sm btn-outline">Comentar</button>
                <button className="btn btn-sm btn-outline btn-error" onClick={()=> props.cancelar(false)} >Cancelar</button>
            </div>
        </>
    )
}