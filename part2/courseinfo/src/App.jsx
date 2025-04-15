const Header = (props) => <h1>{props.course}</h1>

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Content = ({parts}) => (
  <div>
    {parts.map((p) =>
      <Part key={p.name} part={p} />
    )}
  </div>
)

const Total = (props) => <p>Number of exercises {props.total}</p>

const Course = ({course}) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total
        total={0}
      />
    </div>
  )
}

const App = () => {
  const c = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
      },
      {
        name: 'State of a component',
        exercises: 14,
      },
    ],
  }
  return <Course course={c} />
}

export default App
