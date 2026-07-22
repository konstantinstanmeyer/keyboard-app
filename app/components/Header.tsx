export default function Header(){
    return(
        <header className="pt-14 pb-8 text-center">
            <div className="text-[11px] tracking-[0.42em] uppercase accent">
                a typing copybook of
            </div>
            <h1
                className="mt-2 text-[40px] leading-none tracking-[0.16em] uppercase font-medium"
            >
                LINOTYPE
            </h1>
            <div className="mt-3 flex items-center justify-center gap-3 muted">
                <span className="h-px w-10" />
                <span className="text-[13px] italic">
                forgotten words, one keystroke at a time
                </span>
                <span className="h-px w-10" />
            </div>
        </header>
    )
}
