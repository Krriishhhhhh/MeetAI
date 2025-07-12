import Image from "next/image"

interface Props {
    title: string,
    description: string,
    image?: string
}

// THIS IS THE EMPTY STATE WHICH WILL BE USER THROUGHOUT THE PROJECT 

export const EmptyState = ({ title, description, image = "/empty.svg" }: Props) => {
    return (
        <div className="flex flex-col items-center justify-center ">

            {/* Image  */}
            <Image src="/empty.svg" alt="Empty" width={240} height={240} />

            {/* Text Below the Image */}
            <div className="flex flex-col gap-y-6 max-w-md mx-auto text-center">
                <h6 className="text-lg font-medium">{title}</h6>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>


        </div>
    )
}