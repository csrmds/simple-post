export default function comment(props) {
    return (
        <>
            <div>
                <div tabIndex={0} className="collapse collapse-arrow bg-base-300">
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title">
                        <div className="avatar">
                            <div className="w-8 rounded-full">
                                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                            </div>
                            <h1 className="pl-2 font-semibold">{props.userName}</h1>
                        </div>
                    </div>
                    <div className="collapse-content">
                        <p>Comentario rolando por aqui.. </p>
                    </div>
                </div>
            </div>
        </>
    )
}