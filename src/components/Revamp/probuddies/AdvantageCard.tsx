export default function AdvantageCard(){
    return (
        <div className="w-[420px] h-[380px] rounded-3xl bg-white py-8 px-6 flex flex-col justify-between">

            <div className="flex justify-start">
                <img src="/Frame.svg" alt="advantage_icon" />
            </div>


            <div className="flex flex-col items-start justify-center gap-3">
                <h1 className="text-[28px] font-semibold text-(--text-main)">Exam led content</h1>
                <p className="text-[1.125rem] text-(--text-muted) font-medium">Lorem ipsum dolor sit amet consectetur. Senectus arcu cras at risus a tortor ut quam in. </p>
            </div>

        </div>
    );
}