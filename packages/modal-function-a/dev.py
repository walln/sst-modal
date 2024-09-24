# /// script
# dependencies = [
#   "rich",
# ]
# ///


if __name__ == "__main__":
    import sys
    import subprocess
    import rich

    app_ref = sys.argv[1]
    environment = sys.argv[2]
    modal_app_name = sys.argv[3]

    rich.print(f"[bold blue]Deploying {app_ref} to environment:{environment}")
    subprocess.run(
        [
            "uv",
            "tool",
            "run",
            "modal",
            "deploy",
            app_ref,
            "--env",
            environment,
        ]
    )

    rich.print(
        f"[bold green]Successfully deployed {app_ref} to environment:{environment}"
    )

    rich.print(f"[bold purple]Starting log tailing for {modal_app_name}")
    subprocess.run(
        [
            "uv",
            "tool",
            "run",
            "modal",
            "app",
            "logs",
            modal_app_name,
            "--env",
            environment,
        ]
    )
