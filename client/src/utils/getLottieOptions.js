import animationData from "../assets/typing.json"

const getLottieOptions = () => ({
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
})

export default getLottieOptions