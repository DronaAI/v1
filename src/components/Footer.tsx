export function Footer() {
    return (
      <footer className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-indigo-900">Drona.AI</h3>
              <p className="text-gray-600">Your AI-powered learning companion.</p>
            </div>
            <FooterColumn title="Learn" links={["Courses", "Tutorials", "Quiz"]} />
            <FooterColumn title="Company" links={["About", "Careers", "Blog"]} />
            <FooterColumn title="Connect" links={["Twitter", "LinkedIn", "Contact"]} />
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>&copy; 2024 Drona.AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }
  
  function FooterColumn({ title, links }) {
    return (
      <div>
        <h4 className="text-lg font-semibold mb-4 text-indigo-900">{title}</h4>
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link}>
              <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">{link}</a>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  
  