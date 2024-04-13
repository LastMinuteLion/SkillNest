import React from 'react'
import { Link } from 'react-router-dom'
import {FaArrowRight} from "react-icons/fa"
import HighlightText from '../components/core/HomePage/HighlightText'
import Button from '../components/core/HomePage/Button'
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../components/core/HomePage/CodeBlocks'
import TimeLineSection from '../components/core/HomePage/TimeLineSection'
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection'
import Instructor from '../components/core/HomePage/Instructor'
import Footer from '../components/common/Footer'
import ExploreMore from '../components/core/HomePage/ExploreMore'

const Home = () => {
  return (
    <div className='bg-richblack-900'> 
        {/* Section 1 */}
    
    <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center 
      text-white justify-between'>

     {/* Become a Instructor Button */}
    <Link to={"/signup"}>
    <div className=' group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
            transition-all duration-200 hover:scale-95 w-fit'>
                <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
                transition-all duration-200 group-hover:bg-richblack-900'>
                    <p>Become an Instructor</p>
                    <FaArrowRight />
                </div>
            </div>
    </Link>


    {/* Heading */}
        <div className="text-4xl text-center font-semibold mt-7">
          Empower Your Future with <HighlightText text={"Coding Skills"} />
        </div>


       {/* Sub Heading */}
        <div className="mt-3 w-[80%] text-center text-lg font-bold text-richblack-300">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

        {/* CTA Buttons*/}
        <div className="mt-8 flex flex-row gap-7">
          <Button active={true} linkto={"/signup"}>
            Learn More
          </Button>
          <Button active={false} linkto={"/login"}>
            Book a Demo
          </Button>
        </div>
  
        {/* Video */}
        <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
          <video
            className="shadow-[20px_20px_rgba(255,255,255)]"
            muted
            loop
            autoPlay
          >
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/*Code section 1*/}
        <div>
          <CodeBlocks
            heading={
              <div>
                Unlock your <HighlightText text={"coding potential"} /> with our
                online courses.
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            btn1={{
              btnText: "Try it Yourself",
              link: "/signup",
              active: true,
            }}
            btn2={{
              btnText: "Learn More",
              link: "/signup",
              active: false,
            }}
            position={"flex-row"}
            codeColor={"text-yellow-25"}
            codeBlock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            bgGradient={<div className="codeblock1 absolute"></div>}
          />
        </div>

        {/* Code Section 2 */}
        <div>
          <CodeBlocks
            heading={
              <div>
                Start <HighlightText text={"coding in seconds"} />.
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            btn1={{
              btnText: "Continue Lesson",
              link: "/signup",
              active: true,
            }}
            btn2={{
              btnText: "Learn More",
              link: "/signup",
              active: false,
            }}
            position={"flex-row-reverse"}
            codeColor={"text-yellow-25"}
            codeBlock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
            bgGradient={<div className="codeblock2 absolute"></div>}
          />
        </div>
        <ExploreMore />
      </div> 

      <div className="bg-pure-greys-5">
        {/* Two buttons */}
        <div className="homepage_bg h-[333px]">
          <div className="flex gap-5 w-11/12 max-w-maxContent items-center mx-auto">
            <div className="flex text-white mx-auto my-56 gap-6">
              <Button active={true} linkto={"/signup"}>
                <div className="flex items-center gap-2">
                  Explore Full Catalog <FaArrowRight />
                </div>
              </Button>
              <Button active={false} linkto={"/signup"}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
        <div className="flex w-11/12 max-w-maxContent mx-auto py-8">
          <div className="flex gap-24">
            <div className="text-4xl w-[45%]">
              Get the Skills you need for a{" "}
              <HighlightText text={"job that is in demand"} />
            </div>
            <div className="w-[45%] flex flex-col gap-6 items-start">
              <div className="text-richblack-700">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <Button active={true} linkto={"/signup"}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
        <TimeLineSection />
        <LearningLanguageSection />
      </div>

    {/* Section 3 */}
    <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        <Instructor />
      </div>
      <Footer />


    </div>
  )
}

export default Home