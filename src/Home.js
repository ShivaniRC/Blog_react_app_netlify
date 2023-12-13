import Feed from './Feed';
const Home = ({searchResults}) => {
    
    

    return (
        <main className="Home">
            
            { searchResults.length ? (<Feed posts={searchResults} />) : (<p className="statusMsg">No posts to display.</p>)}
        </main>
 
    )

}


export default Home