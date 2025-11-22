# Add to module_extractor.py argparser
parser.add_argument('--list-topics', action='store_true', 
                   help='List available topics and exit without extracting')
# In main():
if args.list_topics:
    print("Available topics for --topic filtering:")
    for topic, terms in AVAILABLE_TOPICS.items():
        print(f"  {topic:12} → {', '.join(terms)}")
    sys.exit(0)