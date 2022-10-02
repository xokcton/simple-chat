const colors = ['yellow', 'purple', 'pink', 'green', 'blue', 'red', 'cyan']

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]

export default getRandomColor