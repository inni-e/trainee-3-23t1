import { postData } from "~/types/dataTypes"
import Image from "next/image"
const Post = ({ post }: { post: postData & { image: string } }) => {

  return (
    <div className="bg-secondary rounded-3xl w-full py-8 px-7 flex flex-col space-y-3 border border-background shadow-default">
      {/* Avatar Group */}
      <div className="flex flex-wrap gap-4">
        {/* Place profile pic here ig */}
        <Image width={48} height={48} alt="pfp" src={post.image} className="h-12 w-12 rounded-full" />
        <div className="flex flex-col gap-1">
          <h5>{post.author}</h5>
          <p>in <span className="text-accent-1 font-semibold">{post.course}</span></p>
        </div>
      </div>
      {/* Post Details */}
      <h4 className="truncate">{post.title}</h4>
      <p className="truncate">{post.content}</p>
    </div>
  )
}

export default Post