import  { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./Header";
import About from "./About";
import Footer from "./Footer";
import Home from "./Home";
import Nav from "./Nav";
import Missing from "./Missing";
import NewPost from "./NewPost";
import PostPage from "./PostPage";
import EditPost from "./EditPost";
import { format } from "date-fns";
import data from "./data";
import useWindowSize from "./hooks/useWindowSize";

function App() {
  
  const initialPosts = () => {
    const storedPosts = JSON.parse(localStorage.getItem("posts"));
  
    // If there are no stored posts or all posts have been deleted, return the default data
    if (!storedPosts || storedPosts.length === 0) {
      return data;
    }
  
    return storedPosts;
  };




  
  const [posts, setPosts] = useState(initialPosts);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const {width} = useWindowSize();
  const navigate = useNavigate();

  useEffect(() => {
     
      localStorage.setItem("posts", JSON.stringify(posts));
      const filteredResults = posts.filter(
        (post) =>
        post.body.toLowerCase().includes(search.toLowerCase()) ||
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    setSearchResults(filteredResults.reverse());
  }, [posts, search]);
  


  const handleSubmit = (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const newPost = { id, title: postTitle, datetime, body: postBody };
    const allPosts = [...posts, newPost];
    setPosts(allPosts);
    setPostTitle("");
    setPostBody("");
    navigate("/");
  };

  const handleDelete =  (id) => {
    
        const postsList = posts.filter(post => post.id !== id);
        setPosts(postsList);
        navigate("/");
  }
   
  
  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const updatedPost = {id, title:editTitle, datetime, body:editBody};
    const updatedPosts = posts.map(post => (post.id === id ? updatedPost : post));
    setPosts(updatedPosts);
    
      setEditTitle('')
      setEditBody('')
      navigate('/');
    } 
    

  return (
    <div className="App">
      <Header title={"Blog"} width={width} />
      <Nav search={search} setSearch={setSearch} />
      <Routes>
        <Route path="/" element={<Home searchResults={searchResults}/>} />
        <Route path="post">
        
        <Route index element={<NewPost 
        handleSubmit={handleSubmit}
        postTitle={postTitle}
        setPostTitle={setPostTitle}
        postBody={postBody}
        setPostBody={setPostBody}/>}/>
      <Route path=":id" element={<PostPage posts={posts}
      handleDelete= {handleDelete}/>}/>
      </Route>
      <Route path="/edit/:id" 
            element={<EditPost 
            posts={posts}
            handleEdit={handleEdit}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            editBody={editBody}
            setEditBody={setEditBody} />} />

        <Route path="about" element={<About />} />
        <Route path="*" element={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
