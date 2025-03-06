import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

// Update the getBlogPost function to show Gabrielle T. Shand as the author
const getBlogPost = (slug: string) => {
  // Sample data - in a real app, you would fetch this from an API or database
  return {
    title: "The Future of AI in Legal Argumentation",
    date: "March 15, 2023",
    author: "Gabrielle T. Shand",
    category: "AI",
    content: `
      <p>Artificial intelligence is rapidly transforming the legal industry, and one of the most promising applications is in the field of legal argumentation. As AI technology continues to advance, it's becoming increasingly capable of analyzing, constructing, and evaluating legal arguments with a level of sophistication that was once thought to be uniquely human.</p>
      
      <h2>The Current State of AI in Legal Argumentation</h2>
      
      <p>Today, AI systems are already being used to assist lawyers in various aspects of legal argumentation. These systems can analyze vast amounts of legal documents, identify relevant precedents, and even suggest potential arguments based on the facts of a case. However, these systems are still primarily tools that augment human capabilities rather than replace them.</p>
      
      <p>The most advanced AI systems in this space, like ThinkTact, use natural language processing and machine learning algorithms to understand the nuances of legal language and the structure of legal arguments. They can identify logical fallacies, assess the strength of evidence, and suggest counterarguments that might be raised by opposing counsel.</p>
      
      <h2>The Future of AI in Legal Argumentation</h2>
      
      <p>Looking ahead, we can expect AI to play an increasingly central role in legal argumentation. As AI systems become more sophisticated, they will be able to generate complete legal arguments, anticipate opposing arguments with greater accuracy, and even adapt their strategies based on the specific judge or court handling a case.</p>
      
      <p>One of the most exciting possibilities is the use of AI to make legal argumentation more accessible to those who cannot afford traditional legal services. AI systems could help individuals construct sound legal arguments without the need for expensive legal representation, potentially democratizing access to justice.</p>
      
      <h2>Challenges and Ethical Considerations</h2>
      
      <p>Despite the promising future of AI in legal argumentation, there are significant challenges and ethical considerations that must be addressed. These include ensuring that AI systems do not perpetuate biases present in existing legal precedents, maintaining transparency in how AI systems reach their conclusions, and determining the appropriate level of human oversight.</p>
      
      <p>Moreover, as AI systems become more capable, questions about the role of human lawyers and the nature of legal practice will become increasingly pressing. Will AI systems eventually replace human lawyers in certain contexts, or will they primarily serve as tools that enhance human capabilities?</p>
      
      <h2>Conclusion</h2>
      
      <p>The future of AI in legal argumentation is both exciting and challenging. As AI technology continues to advance, it has the potential to transform how legal arguments are constructed, analyzed, and evaluated. However, realizing this potential will require careful consideration of the ethical, legal, and practical implications of integrating AI into the legal system.</p>
      
      <p>At ThinkTact, we're committed to developing AI systems that enhance human capabilities in legal argumentation while addressing these important considerations. We believe that the future of legal argumentation lies in the thoughtful integration of AI and human expertise, creating a system that is more efficient, accessible, and just than what exists today.</p>
    `,
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)

  return (
    <div className="flex flex-col min-h-screen">
      <article className="py-12 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <Button asChild variant="ghost" className="mb-8">
            <Link href="/blog" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all posts
            </Link>
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">{post.title}</h1>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span>{post.date}</span>
              <span className="mx-2">•</span>
              <span>{post.category}</span>
              <span className="mx-2">•</span>
              <span>By {post.author}</span>
            </div>
          </div>

          <div
            className="prose prose-gray dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 pt-8 border-t">
            <h3 className="text-xl font-bold mb-4">Share this article</h3>
            <div className="flex space-x-4">
              <Button variant="outline" size="icon">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
                <span className="sr-only">Share on Twitter</span>
              </Button>
              <Button variant="outline" size="icon">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Share on Facebook</span>
              </Button>
              <Button variant="outline" size="icon">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span className="sr-only">Share on LinkedIn</span>
              </Button>
            </div>
          </div>
        </div>
      </article>

      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">Identifying Logical Fallacies with Machine Learning</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  How our AI models are trained to detect and highlight common logical fallacies in arguments.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/blog/identifying-logical-fallacies-machine-learning">Read More</Link>
                </Button>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">The Psychology of Persuasion in Digital Contexts</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Understanding how persuasion techniques translate to digital platforms and AI-assisted argumentation.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/blog/psychology-persuasion-digital-contexts">Read More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

