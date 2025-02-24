import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { ArrowRight, AlignCenter, Layers, LucideWand2 } from 'lucide-react';

function Home() {
    const algorithms = [
        {
            name: "BubbleSort",
            category: "Simple",
            description: "Repeatedly steps through the list, compares adjacent elements, and swaps them if they're in the wrong order",
            complexity: "O(n²)"
        },
        {
            name: "CocktailSort",
            category: "Simple",
            description: "A variation of bubble sort that sorts in both directions on each pass through the list",
            complexity: "O(n²)"
        },
        {
            name: "QuickSort",
            category: "Efficient",
            description: "Divides a large array into smaller sub-arrays using a pivot element",
            complexity: "O(n log n)"
        },
        {
            name: "CombSort",
            category: "Simple",
            description: "Improves on bubble sort by using gap of size more than 1",
            complexity: "O(n²)"
        },
        {
            name: "InsertionSort",
            category: "Simple",
            description: "Builds the sorted array one item at a time by comparisons",
            complexity: "O(n²)"
        },
        {
            name: "ShellSort",
            category: "Efficient",
            description: "Improves insertion sort by allowing the exchange of items that are far apart",
            complexity: "O(n log² n)"
        },
        {
            name: "GnomeSort",
            category: "Simple",
            description: "Similar to insertion sort but moves elements to their proper position by series of swaps",
            complexity: "O(n²)"
        },
        {
            name: "BitonicSort",
            category: "Complex",
            description: "Parallel algorithm particularly suited for hardware implementation",
            complexity: "O(log² n)"
        },
        {
            name: "SelectionSort",
            category: "Simple",
            description: "Repeatedly selects the smallest element and puts it in its final position",
            complexity: "O(n²)"
        },
        {
            name: "HeapSort",
            category: "Efficient",
            description: "Uses a binary heap data structure to sort elements",
            complexity: "O(n log n)"
        },
        {
            name: "MergeSort",
            category: "Efficient",
            description: "Divides the array in half, sorts each half, then merges them back together",
            complexity: "O(n log n)"
        },
        {
            name: "TimSort",
            category: "Efficient",
            description: "Hybrid algorithm derived from merge sort and insertion sort",
            complexity: "O(n log n)"
        },
        {
            name: "CycleSort",
            category: "Efficient",
            description: "Minimizes the number of memory writes with optimal complexity",
            complexity: "O(n²)"
        },
        {
            name: "OddEvenSort",
            category: "Simple",
            description: "Compares all odd/even indexed pairs of adjacent elements and swaps if needed",
            complexity: "O(n²)"
        },
        {
            name: "RadixSort",
            category: "Efficient",
            description: "Processes individual digits by their positional value",
            complexity: "O(nk)"
        },
        {
            name: "BogoSort",
            category: "Fun",
            description: "Repeatedly checks if the list is sorted, and if not, randomly shuffles elements",
            complexity: "O(n × n!)"
        }
    ];    

    // Function to add spaces before capital letters
    const formatAlgorithmName = (name) => {
        return name.replace(/([A-Z])/g, ' $1').trim();
    };

    // Function to get icon for category
    const getCategoryIcon = (category) => {
        switch(category) {
            case "Simple":
                return <AlignCenter className="w-4 h-4" />;
            case "Efficient":
                return <Layers className="w-4 h-4" />;
            case "Complex":
                return <LucideWand2 className="w-4 h-4" />;
            case "Fun":
                return <LucideWand2 className="w-4 h-4" />;
            default:
                return <AlignCenter className="w-4 h-4" />;
        }
    };

    // Group algorithms by category
    const groupedAlgorithms = algorithms.reduce((acc, algo) => {
        if (!acc[algo.category]) {
            acc[algo.category] = [];
        }
        acc[algo.category].push(algo);
        return acc;
    }, {});

    // Sort categories in this order: Simple, Efficient, Complex, Fun
    const categoryOrder = ["Simple", "Efficient", "Complex", "Fun"];
    const sortedCategories = Object.keys(groupedAlgorithms).sort(
        (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
    );

    return (
        <div className="min-h-screen w-full p-4 md:p-8 bg-background">
            <div className="max-w-6xl mx-auto mt-24 space-y-12">
                {/* Hero Section */}
                <section className="text-center space-y-4 mb-16">
                    <h1 className="text-5xl md:text-7xl font-bold p-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                        Algorithm Visualizer
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Explore and understand 16 different sorting algorithms through interactive visualizations.
                    </p>
                </section>
                
                {/* Algorithms by Category */}
                {sortedCategories.map(category => (
                    <section key={category} className="space-y-4">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-primary/10 rounded-full">
                                {getCategoryIcon(category)}
                            </div>
                            <h2 className="text-2xl font-semibold">{category} Algorithms</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {groupedAlgorithms[category].map((algo) => (
                                <Link key={algo.name} to={`/${algo.name}`}>
                                    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50 group relative">
                                        {/* Subtle gradient glow effect in the bottom right corner */}
                                        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-primary/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-lg"></div>
                                        
                                        <CardContent className="p-6">
                                            <div className="flex flex-col h-full">
                                                <div className="mb-4 flex justify-between items-start">
                                                    <h3 className="text-xl font-medium text-foreground group-hover:text-primary transition-colors">
                                                        {formatAlgorithmName(algo.name)}
                                                    </h3>
                                                    <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                                                        {algo.complexity}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                                                    {algo.description}
                                                </p>
                                                <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Visualize <ArrowRight className="ml-1 w-4 h-4" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}

export default Home;