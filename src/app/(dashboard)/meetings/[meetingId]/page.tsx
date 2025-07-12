


interface Props {
    params: Promise<{ meetingId: string }>
}

const Page = async({params}:Props)=>{

    const { meetingId } = await params; //Extracted meetingId from URl

    return(
        <div>
Meetings PAge
        </div>
    )
}

export default Page;