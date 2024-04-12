import React from "react";
import Button from "./Button";
import { TypeAnimation } from "react-type-animation";
import { FaArrowRight } from "react-icons/fa6";

//reverse row function used

const CodeBlocks = ({
  position,
  heading,
  subheading,
  btn1,
  btn2,
  codeBlock,
  bgGradient,
  codeColor,
}) => {
  return (
    <div className={`my-24 w-[100%] flex ${position} gap-16`}>
      {/* Section 1 */}
      <div className="w-[50%] ml-12 flex flex-col gap-4">
        <div className="w-[100%] text-4xl font-semibold lg:w-[80%]">
          {heading}
        </div>
        <div className="text-richblack-300 lg:w-[80%]">{subheading}</div>
        <div className="flex flex-row gap-6 my-8">
          <div className="flex items-center">
            <Button linkto={btn1.linkto} active={btn1.active}>
              <div className="flex items-center gap-2">
                {btn1.btnText}
                <FaArrowRight />
              </div>
            </Button>
          </div>
          <Button linkto={btn2.linkto} active={btn2.active}>
            {btn2.btnText}
          </Button>
        </div>
      </div>
      {/* Section 2 */}
      <div className="h-fit code-border flex flex-row py-3 text-[10px] sm:text-sm leading-[18px] sm:leading-6 relative w-[100%] lg:w-[470px] bg-richblack-800 p-2">
        {bgGradient}
        <div className="flex flex-col w-[10%]">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
          <p>11</p>
        </div>
        <div
          className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-1`}
        >
          <TypeAnimation
            sequence={[codeBlock, 1000, ""]}
            cursor={true}
            repeat={Infinity}
            style={{
              whiteSpace: "pre-line",
              display: "block",
            }}
            omitDeletionAnimation={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;