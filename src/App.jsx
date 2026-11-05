import { posts } from './posts.js'

function App() {
  return (
    <div>
      <h1>Howl</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <p>{post.author}</p>
          <p>{post.location ?? ''}</p>
          <p>{post.time}</p>
          <p>{post.text}</p>
          <hr />
        </div>
      ))}
    </div>
  )
}

export default App
