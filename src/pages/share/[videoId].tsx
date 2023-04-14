import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import ReactPlayer from "react-player";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { getTime } from "~/utils/getTime";
import { ShareModal } from "~/components/ShareModal";
import { useSession } from "next-auth/react";
import VideoMoreMenu from "~/components/VideoMoreMenu";

const VideoList: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { videoId } = router.query as { videoId: string };

  const { data: video, isLoading } = api.video.get.useQuery(
    { videoId },
    {
      enabled: router.isReady,
      refetchOnWindowFocus: false,
    }
  );

  if (!isLoading && !video) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <span className="max-w-[80%] text-center text-2xl font-medium">
          This recording is currently unavailable
        </span>
        <span className="mt-3 max-w-[80%] text-center text-sm">
          To create your own public recordings, create an account for free!
        </span>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen w-screen flex-col items-center justify-center">
        <div className="flex min-h-[62px] w-full items-center justify-between border-b border-solid border-b-[#E7E9EB] bg-white px-6">
          <span>Screenity</span>
          <div className="flex items-center justify-center">
            {video && video.userId === session?.user.id ? (
              <VideoMoreMenu video={video} />
            ) : null}
            <Link href="/videos">
              <span className="cursor-pointer rounded border border-[#0000001a] px-2 py-2 text-sm text-[#292d34] hover:bg-[#fafbfc]">
                Personal Library
              </span>
            </Link>
            {video && video.userId === session?.user.id ? (
              <ShareModal video={video} />
            ) : null}
          </div>
        </div>
        <div className="flex h-full w-full grow flex-col items-center justify-start overflow-auto bg-[#fbfbfb]">
          <div className="flex aspect-video max-h-[627px] w-full justify-center bg-black 2xl:max-h-[1160px]">
            {video?.video_url && (
              <ReactPlayer
                width="100%"
                height="100%"
                controls={true}
                url={video?.video_url}
              />
            )}
          </div>
          <div className="mb-10 mt-4 w-full max-w-[1800px] pl-[24px]">
            <div>
              {video?.title ? (
                <div className="mb-4 flex flex-col">
                  <span className="text-[18px] text-lg font-medium">
                    {video.title}
                  </span>
                  <span className="text-[18px] text-sm text-gray-800">
                    {getTime(video.createdAt)}
                  </span>
                </div>
              ) : (
                <div className="mb-4 flex flex-col">
                  <div className="h-5 w-[300px] animate-pulse rounded bg-slate-200"></div>
                  <div className="mt-2 h-4 w-[50px] animate-pulse rounded bg-slate-200"></div>
                </div>
              )}
            </div>
            <div className="mt-2 flex flex-row items-center">
              {!isLoading ? (
                <>
                  <div className="h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      width={40}
                      height={40}
                      src={
                        video.user.image ??
                        "https://i.stack.imgur.com/dr5qp.jpg"
                      }
                      alt="profile photo"
                    />
                  </div>
                  <span className="ml-3 font-medium">{video.user.name}</span>
                </>
              ) : (
                <>
                  <div className="h-10 w-10 animate-pulse overflow-hidden rounded-full bg-red-400 bg-slate-200"></div>
                  <div className="ml-3 h-4 w-[100px] animate-pulse rounded bg-slate-200 font-medium"></div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default VideoList;
