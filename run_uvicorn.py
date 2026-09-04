import uvicorn
import main

if __name__ == '__main__':
    uvicorn.run(app=main.main, port=8010, host='localhost', use_colors=True)
