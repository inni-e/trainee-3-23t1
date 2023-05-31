import Image from "next/image"

const Course = ({ course }: { course: { code: string, id: string, image: string } }) => {
  return (
    <div className="mt-4 h-16 w-full bg-secondary rounded-lg p-4 flex flex-row space-x-4 border border-background shadow-default">
      {/* image lel */}
      <Image alt="course" src={course.image} height={32} width={32} className="rounded-lg" />
      <div className="bg-accent-1 h-8 w-8 rounded-full"></div>
      <h5 className="m-1">{course.code}</h5>
    </div>
  )
}

export default Course