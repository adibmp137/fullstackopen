const Header = (props) => <h1>{props.course}</h1>

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Content = ({parts}) => (
  <div>
    {parts.map((p) =>
      <Part key={p.id} part={p} />
    )}
  </div>
)

const Total = ({parts}) => (
    <p>
      <b>
        total of {parts.reduce((sum, part) => sum + part.exercises, 0)} exercises
      </b>
    </p>
)

const Subcourse = ({course}) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const Course = ({course}) => {
  return (
    <div>
      {course.map((course) => (
        <Subcourse key={course.id} course={course} />
      ))}
    </div>
  )
}

export default Course