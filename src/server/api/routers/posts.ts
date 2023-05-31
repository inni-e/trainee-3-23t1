import { Post } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { CleanPostType, CleanPublicPostType } from "~/components/types/post";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { postData } from "~/types/dataTypes";

export const postsRouter = createTRPCRouter({
  // creates a new post and returns the post id
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        userId: z.string(),
        courseId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.prisma.post.create({
        data: {
          content: input.content,
          title: input.title,
          userId: input.userId,
          courseId: input.courseId,
        },
      });
      // assumes user exists
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: input.userId,
        },
      });
      // assumes course exists
      const course = await ctx.prisma.course.findFirst({
        where: {
          id: input.courseId,
        },
      });

      return {
        post: {
          id: post.id,
          userName: user?.name,
          courseName: course?.name,
          time: post.timePosted,
        },
      };
    }),

  getPostsOfCourse: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ input, ctx }) => {
      const posts = await ctx.prisma.post.findMany({
        orderBy: {
          timePosted: "asc",
        },
        where: {
          courseId: input.courseId,
        },
      });
      const cleanData: CleanPublicPostType[] = [];
      // cleans the data and gets the user handleStrings
      posts.forEach(async (post) => {
        // get user and course data for user handle and course code
        const user = await ctx.prisma.user.findFirst({
          where: {
            id: post.id,
          },
        });

        const course = await ctx.prisma.course.findFirst({
          where: {
            id: post.courseId,
          },
        });
        // assumes user and course exist
        cleanData.push({
          title: post.title,
          content: post.content,
          handle: user!.handleStr,
          courseCode: course!.code,
        });
      });
      return { posts: cleanData };
    }),

  getPostsOfUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { id: input.userId },
        include: { Posts: true },
      });
      // if no user is found throw an error
      if (!user)
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      // clean up the post data and only send relevant information
      const cleanData: CleanPostType[] = [];
      user.Posts.forEach(async (post) => {
        // assumes course exists
        const course = await ctx.prisma.course.findFirst({
          where: {
            id: post.courseId,
          },
        });
        cleanData.push({
          title: post.title,
          content: post.content,
          courseCode: course!.code,
        });
      });

      return { posts: cleanData };
    }),
  getLatestPosts: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      orderBy: {
        timePosted: "desc",
      },
    });

    type postDataExt = postData & { image: string }
    const cleanData: postDataExt[] = [];

    await new Promise<void>((resolve, reject) => {
      posts.forEach(async (post: Post, index) => {
        // assumes course and user exist
        const course = await ctx.prisma.course.findFirst({
          where: {
            id: post.courseId,
          },
        });
        const user = await ctx.prisma.user.findFirst({
          where: {
            id: post.userId
          }
        });

        // if (user && course)
        cleanData.push({
          author: user!.name,
          image: user!.image,
          content: post.content,
          title: post.title,
          course: course!.code
        });

        if (index === posts.length - 1) resolve();
      });
    })

    return { posts: cleanData };
  }),

  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input, ctx }) => {
      let posts = await ctx.prisma.post.findMany({
        where: {
          title: {
            search: input.query
          }
        }
      });
      if (posts.length === 0) return { posts: [] }

      type postDataExt = postData & { image: string }
      const cleanData: postDataExt[] = [];

      await new Promise<void>((resolve, reject) => {
        posts.forEach(async (post: Post, index) => {
          // assumes course and user exist
          const course = await ctx.prisma.course.findFirst({
            where: {
              id: post.courseId,
            },
          });
          const user = await ctx.prisma.user.findFirst({
            where: {
              id: post.userId
            }
          });

          // if (user && course)
          cleanData.push({
            author: user!.name,
            image: user!.image,
            content: post.content,
            title: post.title,
            course: course!.code
          });

          if (index === posts.length - 1) resolve();
        });
      })
      return { posts: cleanData };
    }),
});



