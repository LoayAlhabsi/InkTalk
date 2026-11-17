import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import Header from './Header';
import BookCard from './BookCard';

const CATEGORIES=[
    'All books',
    'Fiction',
    'History',
    'Memoir',
    'Self-development'
];

const Home=()=>{
    const books=useSelector((state)=>state.books.books);
    const reviews=useSelector((state)=>state.reviews.reviews);
    const user=useSelector((state)=>state.user.user);
    const [search,setSearch]=useState('');
    const [category,setCategory]=useState('All books');
    const [sortBy,setSortBy]=useState('featured');

    const saved=user.savedBooks||[];
    const shelfBooks=books.filter((b)=>saved.includes(b.id));

    const q=search.trim().toLowerCase();
    let filtered=books.filter((b)=>{
        const matchCat=category==='All books'||b.category===category;
        const matchQ=
            !q||
            b.title.toLowerCase().includes(q)||
            b.author.toLowerCase().includes(q);
        return matchCat&&matchQ;
    });

    if(sortBy==='title'){
        filtered=[...filtered].sort((a,b)=>a.title.localeCompare(b.title));
    }else if(sortBy==='author'){
        filtered=[...filtered].sort((a,b)=>a.author.localeCompare(b.author));
    }

    useEffect(()=>{
        if(window.location.hash==='#shelf'){
            document.getElementById('my-shelf')?.scrollIntoView({behavior:'smooth'});
        }
    },[shelfBooks.length]);

    return(
        <div className="app-shell discover-shell">
            <Header showSearch search={search} onSearchChange={setSearch}/>
            <main className="page-body discover-page">
                <section className="discover-hero-panel">
                    <p className="discover-kicker">The reader&apos;s shelf</p>
                    <h1>Find a story worth talking about.</h1>
                    <p>
                        Six books. Different worlds. Discover your next read through the
                        voices of other readers.
                    </p>
                </section>

                <section id="my-shelf" className="my-shelf-section">
                    <div className="reviews-head">
                        <h2>My shelf</h2>
                        <span className="my-reviews-count">
                            {shelfBooks.length} {shelfBooks.length===1?'book':'books'}
                        </span>
                    </div>
                    {shelfBooks.length===0?(
                        <p className="text-muted mb-0">
                            No books saved yet. Open a book and tap &quot;Save to my shelf&quot;.
                        </p>
                    ):(
                        <div className="book-grid discover-grid shelf-grid">
                            {shelfBooks.map((book)=>(
                                <BookCard key={book.id} book={book}/>
                            ))}
                        </div>
                    )}
                </section>

                <div className="discover-toolbar">
                    <div className="chip-row">
                        {CATEGORIES.map((c)=>(
                            <button
                                key={c}
                                type="button"
                                className={`chip ${category===c?'active':''}`}
                                onClick={()=>setCategory(c)}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="discover-meta-row">
                    <p className="discover-count">
                        {category} — {filtered.length}{' '}
                        {filtered.length===1?'title':'titles'}
                    </p>
                    <div className="discover-sort">
                        <span className="discover-sort-note">
                            Ratings reflect {reviews.length} illustrative reader reviews.
                        </span>
                        <label>
                            Sort by:{' '}
                            <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)}>
                                <option value="featured">Featured</option>
                                <option value="title">Title</option>
                                <option value="author">Author</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div className="book-grid discover-grid">
                    {filtered.map((book)=>(
                        <BookCard key={book.id} book={book}/>
                    ))}
                    {filtered.length===0&&(
                        <p className="text-muted">No books match your search.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;
